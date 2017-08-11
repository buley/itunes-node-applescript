tell application "iTunes" to try
	activate
	with timeout of 10 seconds
		reveal current track -- error if no current track
		set tName to name of (first window whose its class is browser window or its class is playlist window)
	end timeout
on error
	return "Can't find track!"
end try

tell application "System Events"
	tell application process "iTunes"
		try
			set b to (first button of window tName whose value of attribute "AXDescription" is "Genius")
			if not (enabled of b) then return "Genius button disabled" -- (film, video clip,...)
			perform action "AXPress" of b
		on error -- no Genius button (radio, podcast, .....) playlist
			return "Can't create genius list from that track!"
		end try
		delay 2
		tell front window to if value of attribute "AXSubRole" is "AXDialog" then -- dialog opened.
			perform action "AXPress" of button "OK" -- close the dialog
			return "Can't create genius list from that track!"
		end if
	end tell
end tell
return "Done"
