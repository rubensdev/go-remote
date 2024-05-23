package main

import (
	"flag"
	"fmt"
	"log"
	"log/slog"
	"net/http"
	"os"

	"github.com/go-chi/chi/v5"
	chiMiddleware "github.com/go-chi/chi/v5/middleware"
	"github.com/gorilla/websocket"
	"github.com/invopop/ctxi18n"
	"rubensdev.com/gotth-starter/internal/translations"
	"rubensdev.com/gotth-starter/views"
)

func main() {
	logger := slog.New(slog.NewJSONHandler(os.Stdout, nil))
	addr := flag.String("addr", ":3000", "server host address (:<port> to be available on LAN)")

	flag.Parse()

	var listenAddr string

	listenAddr, exists := os.LookupEnv("LISTEN_ADDR")
	if !exists {
		listenAddr = *addr
	}

	if err := ctxi18n.LoadWithDefault(translations.Content, "es"); err != nil {
		panic(fmt.Errorf("loading locales: %w", err))
	}

	r := chi.NewRouter()
	r.Use(chiMiddleware.Logger)
	r.Handle("/*", GetStaticHandler())

	wsUpgrader := websocket.Upgrader{
		ReadBufferSize:  1024,
		WriteBufferSize: 1024,
	}

	r.Get("/ws", func(w http.ResponseWriter, r *http.Request) {
		// Upgrade the HTTP connection to a Websocket connection.
		conn, err := wsUpgrader.Upgrade(w, r, nil)
		if err != nil {
			log.Printf("error: %v", err)
			return
		}
		// Read messages from the client.
		for {
			// Read a message from the client
			_, message, err := conn.ReadMessage()
			if err != nil {
				if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
					log.Printf("error reading message from client: %v\n", err)
				}
				return
			}
			handleAction(string(message))
		}
	})

	// Go to Spanish by default
	r.Get("/", func(w http.ResponseWriter, r *http.Request) {
		http.Redirect(w, r, "/es", http.StatusMovedPermanently)
	})

	// Spanish Routes
	r.Route("/es", func(r chi.Router) {
		r.Use(translations.LangMiddleware)
		r.Get("/", func(w http.ResponseWriter, r *http.Request) {
			views.Home().Render(r.Context(), w)
		})
	})

	// English Routes
	r.Route("/en", func(r chi.Router) {
		r.Use(translations.LangMiddleware)
		r.Get("/", func(w http.ResponseWriter, r *http.Request) {
			views.Home().Render(r.Context(), w)
		})
	})

	logger.Info("Server listening on address", "addr", listenAddr)
	http.ListenAndServe(listenAddr, r)
}
