package main

import (
	"strconv"
	"strings"

	"github.com/go-vgo/robotgo"
)

var commands map[string]string = map[string]string{
	"volume_down":   "audio_vol_down",
	"volume_up":     "audio_vol_up",
	"volume_mute":   "audio_mute",
	"arrow_down":    "down",
	"arrow_left":    "left",
	"arrow_right":   "right",
	"arrow_up":      "up",
	"play_pause":    "audio_play",
	"skip_previous": "audio_prev",
	"skip_next":     "audio_next",
}

func handleAction(msg string) {
	args := strings.Split(msg, " ")

	switch args[0] {
	case "move":
		handleMouseMove(args[1])
		return
	case "click":
		handleMouseClick(args[1])
		return
	case "key":
		robotgo.KeyTap(args[1])
		return
	}

	if _, exists := commands[args[0]]; exists {
		robotgo.KeyTap(commands[args[0]])
	}
}

func handleMouseMove(args string) {
	posX, posY := getMouseCoords(args)
	currentX, currentY := robotgo.Location()

	robotgo.Move(currentX+posX, currentY+posY)
}

func handleMouseClick(args string) {
	parsedArgs := strings.Split(args, "|")

	if parsedArgs[0] == "0" {
		robotgo.Click("left")
	} else if parsedArgs[0] == "1" {
		robotgo.Click("right")
	}
}

func getMouseCoords(args string) (int, int) {
	parsedArgs := strings.Split(args, "|")

	x, err := strconv.Atoi(parsedArgs[0])
	if err != nil {
		return 0, 0
	}

	y, err := strconv.Atoi(parsedArgs[1])
	if err != nil {
		return 0, 0
	}

	return x, y
}
