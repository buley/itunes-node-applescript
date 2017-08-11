tell application "iTunes" to tell artwork 1 of current track
	set srcBytes to raw data
	if format is «class PNG » then
		set ext to ".png"
	else
		set ext to ".jpg"
	end if
end tell

set fileName to (((path to temporary items) as text) & "cover" & ext)
set outFile to open for access file fileName with write permission
set eof outFile to 0
write srcBytes to outFile
close access outFile
get POSIX file (((path to temporary items) as text) & "cover" & ext)

