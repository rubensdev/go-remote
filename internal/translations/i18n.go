package translations

import (
	"embed"
	"net/http"
	"strings"

	"github.com/invopop/ctxi18n"
)

//go:embed translations/*
var Content embed.FS

func LangMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		lang := strings.Split(r.URL.Path, "/")[1]

		ctx, err := ctxi18n.WithLocale(r.Context(), lang)
		if err != nil {
			panic(err)
		}

		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
