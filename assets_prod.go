//go:build !dev
// +build !dev

package main

import (
	"embed"
	"net/http"
)

//go:embed static
var publicFS embed.FS

func GetStaticHandler() http.Handler {
	return http.FileServerFS(publicFS)
}
