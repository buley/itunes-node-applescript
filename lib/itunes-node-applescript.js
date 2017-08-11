var util = require('util'),
    exec = require('child_process').exec,
    applescript = require('applescript');

// Apple scripts
// ----------------------------------------------------------------------------

var scripts = {
    tracks: 
        'tell application "iTunes" to get count of tracks of (get view of front window)',
    track:
        'tell application "iTunes" to get the current track',
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
    playArtist:
        'tell application "iTunes" to play (first track of playlist "Library" whose artist is "%s")',
    playTrack:
        'tell application "iTunes" to play (first track of playlist "Library" whose name is "%s")',
    playAlbum:
        'tell application "iTunes" to play (first track of playlist "Library" whose album is "%s")',
    playTrackInContext:
        'tell application "iTunes" to play track "%s" in context "%s"',
    playPause:
        'tell application "iTunes" to playpause',
    playRadio:
        'tell application "iTunes" to play (first track of playlist "Radio" whose name is "%s")',
    pause:
        'tell application "iTunes" to pause',
    next:
        'tell application "iTunes" to play next track',
    previous:
        'tell application "iTunes" to play previous track',
    forward:
        'tell application "iTunes" to set player position to %s',
    reverse:
        'tell application "iTunes" to set player position to -%s',
    isRunning:
        'get running of application "iTunes"',
    shuffle:
	'tell application "iTunes" to set shuffle enabled to true',
    unshuffle:
	'tell application "iTunes" to set shuffle enabled to false',
    repeat:
	'tell application "iTunes" to set song repeat to on',
    unrepeat:
	'tell application "iTunes" to set song repeat to off'


};

// Apple script execution
// ----------------------------------------------------------------------------

var scriptsPath = __dirname + '/scripts/';

var execScript = function(scriptName, params, callback){
    if (arguments.length === 2 && typeof params === 'function'){
        // second argument is the callback
        callback = params;
        params = undefined;
    }

    // applescript lib needs a callback, but callback is not always useful
    if (!callback) callback = function(){};

    if (typeof params !== 'undefined' && !Array.isArray(params)){
        params = [params];
    }

    var script = scripts[scriptName];
    console.log("SCRIPT: " + script, params);
    if (typeof script === 'string'){
        if (typeof params !== 'undefined') script = util.format.apply(util, [script].concat(params));
        return applescript.execString(script, callback);
    } else if (!!script && script.file){
        return applescript.execFile(scriptsPath + script.file, callback);
    }
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

// API
// ----------------------------------------------------------------------------

// Open track

exports.open = function(uri, callback){
    return exec('open "'+uri+'"', callback);
};

exports.openLocation = function(track, callback){
    return execScript('openLocation', track, callback);
};

exports.playPlaylist = function(playlist, callback){
    return execScript('playPlaylist', playlist, callback);
};

exports.playAlbum = function(track, callback){
    return execScript('playAlbum', track, callback);
};

exports.playArtist = function(playArtist, callback){
    return execScript('playArtist', playArtist, callback);
};

exports.playlists = function(callback){
    return execScript('playlists', callback);
};

exports.playRadio = function(playRadio, callback){
    return execScript('playRadio', playRadio, callback);
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

// State retrieval

exports.getTrackCount = function(callback){
    return execScript('tracks', createJSONResponseHandler(callback, 'tracks'));
};


exports.getTrackInfo = function(callback){
    //console.log("getTrack"+callback);
    return execScript('track', createJSONResponseHandler(callback, 'track'));

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
