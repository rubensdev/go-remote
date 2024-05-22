//go:build dev
// +build dev

package main

import (
	"net/http"
	"os"

	"rubensdev.com/gotth-starter/internal/middleware"
)

func GetStaticHandler() http.Handler {
	return middleware.DisableCache(
		http.StripPrefix("/static/", http.FileServerFS(os.DirFS("./static"))),
	)
}
