var exec = require('child_process').exec;

var scripts = {
    artwork: {
	file: 'artwork.applescript'
    },
    tracks:
	'tell application "iTunes" to get name of every track of playlist "Library"',
    trackCount: 
        'tell application "iTunes" to get count of tracks of (get view of front window)',
    track:
	'tell application "iTunes" to get {genre, artist, album, id, index, name, time} of the current track',
    volumeUp:
        'tell application "iTunes" to set sound volume to (sound volume + 10)',
    volumeDown:
        'tell application "iTunes" to set sound volume to (sound volume - 10)',
    setVolume:
        'tell application "iTunes" to set sound volume to %s',
    play:
        'tell application "iTunes" to play',
    playPlaylist:
        'tell application "iTunes" to play playlist "%s"', 
    openLocation:
        'tell application "iTunes" to open location "%s"', 
    playlists:
	'tell application "iTunes" to get name of playlists',
    playlistTracks:
	'tell application "iTunes" to get name of every track of playlist "%s"',
    playlistArtistTracks:
	'tell application "iTunes" to get index of every track of playlist "%s" where artist = "%s"',
    playlistAlbumTracks:
	'tell application "iTunes" to get index of every track of playlist "%s" where album = "%s"',
    playlistGenreTracks:
	'tell application "iTunes" to get index of every track of playlist "%s" where genre = "%s"',
    playlistArtistTrackIds:
	'tell application "iTunes" to get id of every track of playlist "%s" where artist = "%s"',
    playlistAlbumTrackIds:
	'tell application "iTunes" to get id of every track of playlist "%s" where album = "%s"',
    playlistGenreTrackIds:
	'tell application "iTunes" to get id of every track of playlist "%s" where genre = "%s"',
    playlistTrack:
	'tell application "iTunes" to get name of track %s of playlist "%s"',
    playlistTrackNumber:
	'tell application "iTunes" to play track %s of playlist "%s"',
    playPlaylistArtist:
	'tell application "iTunes" to play (first track of playlist "%s" whose artist is "%s")',
    playArtist:
	[
		'tell application "iTunes" to if ((count of tracks of playlist "Bot") > 0) then delete playlist "Bot"',
		'tell application "iTunes" to (make new user playlist with properties {name:"Bot", shuffle:false})',
		'tell application "iTunes" to duplicate (every track of playlist "Library" where artist = "%s") to playlist "Bot"',
		'tell application "iTunes" to play playlist "Bot"'
	],
    playTrack:
        'tell application "iTunes" to play (first track of playlist "Library" whose name is "%s")',
    genres:
	'tell application "iTunes" to get genre of every track of playlist "Library"',
    artists:
	'tell application "iTunes" to get artist of every track of playlist "Library"',
    albums:
	'tell application "iTunes" to get album of every track of playlist "Library"',
    playGenre:
	[
		'tell application "iTunes" to if ((count of tracks of playlist "Bot") > 0) then delete playlist "Bot"',
		'tell application "iTunes" to (make new user playlist with properties {name:"Bot", shuffle:false})',
		'tell application "iTunes" to duplicate (every track of playlist "Library" where genre = "%s") to playlist "Bot"',
		'tell application "iTunes" to play playlist "Bot"'
	],
    playAlbum:
	[
		'tell application "iTunes" to if ((count of tracks of playlist "Bot") > 0) then delete playlist "Bot"',
		'tell application "iTunes" to (make new user playlist with properties {name:"Bot", shuffle:false})',
		'tell application "iTunes" to duplicate (every track of playlist "Library" where album = "%s") to playlist "Bot"',
		'tell application "iTunes" to play playlist "Bot"'
	],
    playTrackInContext:
        'tell application "iTunes" to play track "%s" in context "%s"',
    playPause:
        'tell application "iTunes" to playpause',
    pause:
        'tell application "iTunes" to pause',
    next:
        'tell application "iTunes" to play next track',
    previous:
        'tell application "iTunes" to play previous track',
    forward:
        'tell application "iTunes" to set player position to (player position + %s)',
    reverse:
        'tell application "iTunes" to set player position to (player position - %s)',
    position:
        'tell application "iTunes" to set player position to %s',
    getPosition:
        'tell application "iTunes" to get player position',
    isRunning:
        'get running of application "iTunes"',
    shuffle:
	'tell application "iTunes" to set shuffle enabled to true',
    unshuffle:
	'tell application "iTunes" to set shuffle enabled to false',
    repeat:
	'tell application "iTunes" to set song repeat to on',
    unrepeat:
	'tell application "iTunes" to set song repeat to off',
    obs:
	'tell application "OBS" to activate',
    hotkey:
	['tell application "OBS" to activate', 'tell application "System Events" to keystroke "%s"'],
    commandHotkey:
	['tell application "OBS" to activate', 'tell application "System Events" to keystroke "%s" using command down'],
    shiftHotkey:
	['tell application "OBS" to activate', 'tell application "System Events" to keystroke "%s" using shift down'],
    commandShiftHotkey:
	['tell application "OBS" to activate', 'tell application "System Events" to keystroke "%s" using (shift down, command down)']

};

var scriptsPath = __dirname + '/scripts/';
var execScript = function(scriptName, params, callback){
    var e = [],
	applescript = require('applescript'),
	util = require('util'), 
	res = [],
	clone,
	x = 0,
	xlen = 0,
	script = null,
	tmp = null;

    if (arguments.length === 2 && typeof params === 'function'){
	// second argument is the callback
	callback = params;
	params = undefined;
    } else if (arguments.length >= 2 && typeof params === 'function'){
	tmp = params;
	params = Array.prototype.slice.apply(arguments, [2]);
	callback = tmp;
    }

    if (!callback) callback = function(){};

    if (typeof params !== 'undefined' && !Array.isArray(params)){
	params = [params];
    }
    clone = scripts[scriptName];
	    if (typeof clone === 'string'){
		if (!!clone && null !== clone.match(/%/)) {
			if (typeof params !== 'undefined') clone = util.format.apply(util, [clone].concat(params));
		}
		res.push(applescript.execString(clone, callback));
	    } else if (!!clone && !!clone.file){
		res.push(applescript.execFile(scriptsPath + clone.file, [], callback));
	    } else if ('string' !== typeof clone && !!clone && clone.length > 0) {
    		    clone = scripts[scriptName].slice(0);
                    e = clone;
		    xlen = clone.length || 0; 
		    for(x = 0; x < xlen; x += 1) {
			if (null !== clone[x].match(/%/)) {
				if (typeof params !== 'undefined') clone[x] = util.format.apply(util, [clone[x]].concat(params));
			}

		    }
		    res.push(applescript.execString(clone.join("\r\n"), callback));
	     }
	if (1 === res.length) {
		return res[0];
	}
	return res;
};

var createJSONResponseHandler = function(callback, flag){
    if (!callback) return null;
    return function(error, result){
        if (!error){
            try {
                result = JSON.parse(result);
            } catch(e){
                return callback(result);
            }
            return callback(null, result);
        } else {
            return callback(error);
        }
    };
};

exports.open = function(uri, callback){
    return exec('open "'+uri+'"', callback);
};

exports.openLocation = function(track, callback){
    return execScript('openLocation', track, callback);
};

exports.hotkey = function(command, callback){
    return execScript('hotkey', command, callback);
};
exports.shiftHotkey = function(command, callback){
    return execScript('shiftHotkey', command, callback);
};
exports.commandHotkey = function(command, callback){
    return execScript('commandHotkey', command, callback);
};
exports.commandShiftHotkey = function(command, callback){
    return execScript('commandShiftHotkey', command, callback);
};

exports.playPlaylist = function(playlist, callback){
    return execScript('playPlaylist', playlist, callback);
};
exports.playGenre = function(track, callback){
    return execScript('playGenre', track, callback);
};
exports.genres = function(callback){
    return execScript('genres', callback);
};
exports.artists = function(callback){
    return execScript('artists', callback);
};
exports.albums = function(callback){
    return execScript('albums', callback);
};
exports.playlistTracks = function(playlist, callback){
    return execScript('playlistTracks', playlist, callback);
};
exports.playlistArtistTracks = function(playlist, artist, callback){
    return execScript('playlistArtistTracks', playlist, artist, callback);
};
exports.playlistAlbumTracks = function(playlist, album, callback){
    return execScript('playlistAlbumTracks', playlist, album, callback);
};
exports.playlistGenreTracks = function(playlist, genre, callback){
    return execScript('playlistGenreTracks', playlist, genre, callback);
};








exports.playAlbum = function(track, callback){
    return execScript('playAlbum', track, callback);
};

exports.playArtist = function(playArtist, callback){
    return execScript('playArtist', playArtist, callback);
};

exports.playPlaylistArtist = function(playPlaylist, playArtist, callback){
    return execScript('playPlaylistArtist', playPlaylist, playArtist, callback);
};

exports.playlists = function(callback){
    return execScript('playlists', callback);
};

exports.playTrack = function(track, callback){
    return execScript('playTrack', track, callback);
};

exports.playTrackInContext = function(track, context, callback){
    return execScript('playTrackInContext', [track, context], callback);
};

// Playback control

exports.play = function(callback){
    return execScript('play', callback);
};

exports.pause = function(callback){
    return execScript('pause', callback);
};

exports.playPause = function(callback){
    return execScript('playPause', callback);
};

exports.next = function(callback){
    return execScript('next', callback);
};

exports.previous = function(callback){
    return execScript('previous', callback);
};
exports.forward = function(position, callback){
    return execScript('forward', position, callback);
};
exports.reverse = function(position, callback){
    return execScript('reverse', position, callback);
};
exports.position = function(position, callback){
    return execScript('position', position, callback);
};
exports.getPosition = function(position, callback){
    return execScript('getPosition', callback);
};





exports.jumpTo = function(position, callback){
    return execScript('jumpTo', position, callback);
};

// Volume control

var mutedVolume = null;

exports.volumeUp = function(callback){
    mutedVolume = null;
    return execScript('volumeUp', callback);
};

exports.volumeDown = function(callback){
    mutedVolume = null;
    return execScript('volumeDown', callback);
};

exports.setVolume = function(volume, callback){
    mutedVolume = null;
    return execScript('setVolume', volume, callback);
};

exports.Volume = function(volume, callback){
    mutedVolume = null;
    return execScript('setVolume', volume, callback);
};
 
exports.sendPlayCount = function(iTunesTrackNumber, callback){
    mutedVolume = null;
    return execScript('sendPlayCount', iTunesTrackNumber, callback);
};

exports.unshuffle = function(callback){
    return execScript('unshuffle', callback);
};

exports.shuffle = function(callback){
    return execScript('shuffle', callback);
};

exports.unrepeat = function(callback){
    return execScript('unrepeat', callback);
};

exports.repeat = function(callback){
    return execScript('repeat', callback);
};

exports.muteVolume = function(callback){
    return execScript('state', createJSONResponseHandler(function(err, state) {
        exports.setVolume(0, callback);
        mutedVolume = state.volume;
    }));
};

exports.unmuteVolume = function(callback){
    if (mutedVolume !== null) {
        return exports.setVolume(mutedVolume, callback);
    }
};
exports.unmuteVolume = function(callback){
    if (mutedVolume !== null) {
        return exports.setVolume(mutedVolume, callback);
    }
};

exports.getTrackCount = function(callback){
    return execScript('tracks', callback);
};

exports.artwork = function(callback){
    return execScript('artwork', function(err, src) {
        src = src || '';
	callback(src.replace('file ":Macintosh HD', '').replace('"',''))
    });
};
exports.tracks = function(callback){
    return execScript('tracks', callback);
};
exports.track = function(callback){
    return execScript('track', callback);
};

exports.getState = function(callback){
    return execScript('state', createJSONResponseHandler(callback, 'state'));
};

exports.isRunning = function(callback) {
    return execScript('isRunning', function(error, response) {
        if (!error) {
            return callback(null, response === 'true' ? true : false);
        } else {
            return callback(error);
        }
    });
};
