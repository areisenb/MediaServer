// Default MediaTomb import script.
// see MediaTomb scripting documentation for more information

/*MT_F*
    
    MediaTomb - http://www.mediatomb.cc/
    
    import.js - this file is part of MediaTomb.
    
    Copyright (C) 2006-2008 Gena Batyan <bgeradz@mediatomb.cc>,
            Sergey 'Jin' Bostandzhyan <jin@mediatomb.cc>,
            Leonhard Wimmer <leo@mediatomb.cc>
    
    This file is free software; the copyright owners give unlimited permission
    to copy and/or redistribute it; with or without modifications, as long as
    this notice is preserved.
    
    This file is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
    
    $Id: import.js 1720 2008-03-01 19:36:53Z jin_eld $
*/

function addAudio(obj)
{
 
    var desc = '';
    var artist_full;
    var album_full;
    var artist = '';

    // first gather data
    var title = obj.meta[M_TITLE];
    if (!title) title = obj.title;
    
    artist = orig.aux['TPE2'];
    if (!artist)
        artist = obj.meta[M_ARTIST];
    if (!artist) 
    {
        artist = '-unknown-';
        artist_full = null;
    }
    else
    {
        artist_full = artist;
        desc = artist;
    }
    
    var album = obj.meta[M_ALBUM];
    if (!album) 
    {
        album = '-unknown-';
        album_full = null;
    }
    else
    {
        desc = desc + ', ' + album;
        album_full = album;
    }

    var discno = obj.aux['TPOS'];
    
    if (desc)
        desc = desc + ', ';
    
    desc = desc + title;
    
    var date = obj.meta[M_DATE];
	var decade; // used for extra division into decades

    if (!date)
    {
        date = '-unknown-';
		decade = null;
    }
    else
    {
        date = getYear(date);
		decade = date.substring(0,3) + '0 - ' + String(10 * (parseInt(date.substring(0,3))) + 9) ;
        desc = desc + ', ' + date;
    }
    
    var genre = obj.meta[M_GENRE];
    if (!genre)
    {
        genre = '-unknown-';
    }
    else
    {
        desc = desc + ', ' + genre;
    }
    
    var description = obj.meta[M_DESCRIPTION];
    if (!description) 
    {
        obj.meta[M_DESCRIPTION] = desc;
    }
    
    print ("Import Audio: " + desc);

// for debugging only
//    print ("   M_TITLE =      " + orig.meta[M_TITLE]);
//    print ("   M_ARTIST=      " + orig.meta[M_ARTIST]);
//    print ("   M_ALBUM=       " + orig.meta[M_ALBUM]);
//    print ("   M_DATE=        " + orig.meta[M_DATE]);
//    print ("   M_GENRE=       " + orig.meta[M_GENRE]);
//    print ("   M_DESCRIPTION= " + orig.meta[M_DESCRIPTION]);
//    print ("   M_REGION=      " + orig.meta[M_REGION]);
//    print ("   M_TRACKNUMBER= " + orig.meta[M_TRACKNUMBER]);
//    print ("   M_AUTHOR=      " + orig.meta[M_AUTHOR]);
//    print ("   M_DIRECTOR=    " + orig.meta[M_DIRECTOR]);
//    print ("   AUX_TPE2=      " + orig.aux['TPE2']);
//    print ("   M_PUBLISHER=   " + orig.meta[M_PUBLISHER]);
//    print ("   M_RATING=      " + orig.meta[M_RATING]);
//    print ("   M_ACTOR=       " + orig.meta[M_ACTOR]);
//    print ("   M_PRODUCER=    " + orig.meta[M_PRODUCER]);

// uncomment this if you want to have track numbers in front of the title
// in album view

    var track = obj.meta[M_TRACKNUMBER];
    if (!track)
        track = '';
    else
    {
        if (track.length == 1)
        {
            track = '0' + track;
        }
        if (discno)
        {
           track = discno + track;
           obj.meta[M_TRACKNUMBER] = track;
        }
        track = track + ' - ';
    }
// comment the following line out if you uncomment the stuff above  :)
//    var track = '';

// Start of parsing audio ///////////////////////////////////////////////

	var disctitle = '';
	var album_artist = '';
	var tracktitle = '';
	
// ALBUM //
// Extra code for correct display of albums with various artists (usually Collections)
    if (!description)
	{
		album_artist = album + ' - ' + artist;
		tracktitle = track + title;
	}
	else
	{
	    if (description.toUpperCase() == 'VARIOUS')
		{
			album_artist = album + ' - Various';
			tracktitle = track + title + ' - ' + artist;
		}
	    else
		{
			album_artist = album + ' - ' + artist;
			tracktitle = track + title;
		}
	}

// ALBUM //
	// current
	// we do not need this sorting currently ...
	//chain = new Array('-Audio-', '-Album-', abcbox(album, 6, '-'), 
	//				album.charAt(0).toUpperCase(), album_artist);
	//obj.title = tracktitle;
	//addCdsObject(obj, createContainerChain(chain), UPNP_CLASS_CONTAINER_MUSIC_ALBUM);
	// DEBUG ONLY print ("Added Audio -Album-ABCD-" + album.charAt(0).toUpperCase() + "-" + album_artist + "-: " + tracktitle);

// ARTIST //
	chain = new Array('-Audio-', '-Artist-', abcbox(artist, 6, '-'),
					artist.charAt(0).toUpperCase(), artist, '-all-');
    obj.title = title + ' (' + album + ', ' + date + ')'; 
	// DEBUG ONLY print ("Added Audio -Artist-ABCD-" + artist.charAt(0).toUpperCase() + "-" + artist + "-all-: " + obj.title);
	addCdsObject(obj, createContainerChain(chain), UPNP_CLASS_CONTAINER_MUSIC_ARTIST);

	obj.title = tracktitle;
	chain = new Array('-Audio-', '-Artist-', abcbox(artist, 6, '-'), 
					artist.charAt(0).toUpperCase(), artist, date + " - " + album);
	//	obj.title = tracktitle;
	// DEBUG ONLY print ("Added Audio -Artist-ABCD-" + artist.charAt(0).toUpperCase() + "-" + artist + "-" + date + " - " + album + "-:" + obj.title);
	addCdsObject(obj, createContainerChain(chain), UPNP_CLASS_CONTAINER_MUSIC_ARTIST);
	
// ARTIST flattened //
	chain = new Array('-Audio-', '-Artist-', '_all-', artist, '-all-');
    obj.title = title + ' (' + album + ', ' + date + ')'; 
	// DEBUG ONLY print ("Added Audio -Artist-ABCD-" + artist.charAt(0).toUpperCase() + "-" + artist + "-all-: " + obj.title);
	addCdsObject(obj, createContainerChain(chain), UPNP_CLASS_CONTAINER_MUSIC_ARTIST);

	obj.title = tracktitle;
	chain = new Array('-Audio-', '-Artist-', '_all-', artist, date + " - " + album);
	//	obj.title = tracktitle;
	// DEBUG ONLY print ("Added Audio -Artist-ABCD-" + artist.charAt(0).toUpperCase() + "-" + artist + "-" + date + " - " + album + "-:" + obj.title);
	addCdsObject(obj, createContainerChain(chain), UPNP_CLASS_CONTAINER_MUSIC_ARTIST);
	
// GENRE //
    // no sense for GENRE - unsorted typically
    
    // chain = new Array('-Audio-', '-Genre-', genre, '-all-');
    // obj.title = title + ' - ' + artist_full;
    // addCdsObject(obj, createContainerChain(chain), UPNP_CLASS_CONTAINER_MUSIC);
    
    // chain = new Array('-Audio-', '-Genre-', genre, abcbox(artist, 6, '-'), artist.charAt(0).toUpperCase(), artist, album);
	// if (!discno) { obj.title = tracktitle; }
	// else { obj.title = disctitle; }
	// addCdsObject(obj, createContainerChain(chain), UPNP_CLASS_CONTAINER_MUSIC_ARTIST);

// TRACKS //
    // no "all" tracks - does not make any sense
    // var chain = new Array('-Audio-', '-Track-', '-all-');
    // obj.title = title + ' - ' + artist_full;
    // addCdsObject(obj, createContainerChain(chain), UPNP_CLASS_CONTAINER_MUSIC);

	chain = new Array('-Audio-', '-Track-', abcbox(title, 6, '-'), title.charAt(0).toUpperCase());
    obj.title = title + ' - ' + artist + ' (' + album + ', ' + date + ')';
	// DEBUG ONLY print ("Added Audio -Track-ABCD-" + title.charAt(0).toUpperCase() + "-: " + obj.title);
    addCdsObject(obj, createContainerChain(chain), UPNP_CLASS_CONTAINER_MUSIC_ARTIST);

// ALL //
//    chain = new Array('-Audio-', '-all-');
//    obj.title = title + ' - ' + artist;
//    addCdsObject(obj, createContainerChain(chain), UPNP_CLASS_CONTAINER_MUSIC);

// YEAR //
// Ordered into decades    
	if (!decade)
	{
		chain = new Array('-Audio-', '-Year-', date, abcbox(artist, 6, '-'), artist.charAt(0).toUpperCase(), artist, album);
		addCdsObject(obj, createContainerChain(chain), UPNP_CLASS_CONTAINER_MUSIC_ALBUM);
	    // DEBUG ONLY print ("Added Audio -Year-" + date + "-ABCD-" + artist.charAt(0).toUpperCase() + "-" + artist + "-" + album + "-:" + obj.title);
    }
	else
	{
		chain = new Array('-Audio-', '-Year-', decade, date, '-all-');
		addCdsObject(obj, createContainerChain(chain), UPNP_CLASS_CONTAINER_MUSIC_ARTIST);
	    // DEBUG ONLY print ("Added Audio -Year-" + decade + "-" + date + "-all-" + "-:" + obj.title);

		obj.title = tracktitle;

		chain = new Array('-Audio-', '-Year-', decade, '-all-', artist, album);
		addCdsObject(obj, createContainerChain(chain), UPNP_CLASS_CONTAINER_MUSIC_ALBUM);
	    // DEBUG ONLY print ("Added Audio -Year-" + decade + "-all-" + artist + "-" + album + "-:" + obj.title);

		chain = new Array('-Audio-', '-Year-', decade, date, artist + " - " + album);
		addCdsObject(obj, createContainerChain(chain), UPNP_CLASS_CONTAINER_MUSIC_ARTIST);
	    // DEBUG ONLY print ("Added Audio -Year-" + decade + "-" + date + "-" + artist + " - " + album + "-:" + obj.title);
	}
}

function addVideo(obj)
// Extra: divided into 8 blocks (this fits in one display on my SLM5500 ...)
// for easy alfabetic search
{
    // first title data
    var title = obj.meta[M_TITLE];
    if (!title) title = obj.title;
 
    // always add to the ALL section
    var chain = new Array('-Video-', '-all-');
    addCdsObject(obj, createContainerChain(chain), UPNP_CLASS_CONTAINER);

    // add the video
    chain = new Array('-Video-', abcbox(title, 9, '-'));
    addCdsObject(obj, createContainerChain(chain), UPNP_CLASS_CONTAINER);
}

/*
function addImage(obj)
// modified to sort into year/month/date subfolder
{
    var chain = new Array('-Photo-', 'All Photos');
    addCdsObject(obj, createContainerChain(chain), UPNP_CLASS_CONTAINER);
    
    var date = obj.meta[M_DATE];
    if (date)
    {
        var arr = date.split('-');
        var year = arr[0];
        var month = arr[1];
//        var day = arr[2];
        chain = new Array('-Photo-', 'Date', year, month, date);
        addCdsObject(obj, createContainerChain(chain), UPNP_CLASS_CONTAINER);
    }
	
	var model = obj.aux['EXIF_TAG_MODEL'];
	if (model)
	{
		chain = new Array('-Photo-', 'Camera Model', model);
		addCdsObject(obj, createContainerChain(chain), UPNP_CLASS_CONTAINER);
	}
	else
	{ print ("No model data found"); }
}
*/

// import photos ************************************************
function addImage(obj)
{
{
	var chain = new Array('-Photo-', 'all photos');
	addCdsObject(obj, createContainerChain(chain), UPNP_CLASS_CONTAINER);
}    

    var dirDescription;
    var dirArray;

    dirDescription = extractLastDir (obj.location);
    dirArray = analyseLastDir (dirDescription);
    chain = new Array('-Photo-', 'Topic', dirArray[0], dirArray[1]);
	addCdsObject(obj, createContainerChain(chain), UPNP_CLASS_CONTAINER);


{   
	//If there is a date add them to the date folder
	var date = obj.meta[M_DATE];
	if (date)
	{
		// per year, all
		chain = new Array('-Photo-', 'Date', date.substr (0, 4), 
		                date.substr (0, 4) + ' all', date.substr (0, 4) + ' all');
		addCdsObject(obj, createContainerChain(chain), UPNP_CLASS_CONTAINER);

		// per year, per date
		chain = new Array('-Photo-', 'Date', date.substr (0, 4), date.substr (0, 4) + ' all', date);
		addCdsObject(obj, createContainerChain(chain), UPNP_CLASS_CONTAINER);

		// per year, per month, all
		chain = new Array('-Photo-', 'Date', date.substr (0, 4), date.substr (0, 7), date.substr (0, 7) + ' all');
		addCdsObject(obj, createContainerChain(chain), UPNP_CLASS_CONTAINER);

		// per year, per month, per date
		chain = new Array('-Photo-', 'Date', date.substr (0, 4), date.substr (0, 7), date);
		addCdsObject(obj, createContainerChain(chain), UPNP_CLASS_CONTAINER);

	}
	else
	{
		chain = new Array('-Photo-', 'Date', 'unknown');
		addCdsObject(obj, createContainerChain(chain), UPNP_CLASS_CONTAINER);
	}
	
	//camera directory with subject subdirectory
	var model = obj.aux['EXIF_TAG_MODEL'];
	if (model) 
	{
		var subject=obj.aux['EXIF_TAG_IMAGE_DESCRIPTION'];
		if (subject)
		{
			subject = firstUppperCase(subject);
			chain = new Array ('-Photo-','Camera',model,subject);
			addCdsObject(obj, createContainerChain(chain), UPNP_CLASS_CONTAINER);
		}
		else
		{
			chain = new Array ('-Photo-', 'Camera',model,'Unknown description');
			addCdsObject(obj, createContainerChain(chain), UPNP_CLASS_CONTAINER);
		}
	}
	else
	{
		var subject=obj.aux['EXIF_TAG_IMAGE_DESCRIPTION'];
		if (subject)
		{
			subject = firstUppperCase(subject);
			chain = new Array ('-Photo-','Camera','Unknown camera',subject);
			addCdsObject(obj, createContainerChain(chain), UPNP_CLASS_CONTAINER);
		}
		else
		{
			chain = new Array ('-Photo-', 'Camera','Unknown camera','Unknown description');
			addCdsObject(obj, createContainerChain(chain), UPNP_CLASS_CONTAINER);
		}
	}
	//subject directory in the parent directory
	var subject=obj.aux['EXIF_TAG_IMAGE_DESCRIPTION'];
	if (subject)
	{
		subject = firstUppperCase(subject);
		chain = new Array ('-Photo-', 'Subject', subject);
		// addCdsObject(obj, createContainerChain(chain), UPNP_CLASS_CONTAINER); right now we do not have any descriptions
	}
	else
	{
		chain = new Array ('-Photo-', 'Subject','Unknown description');
		// addCdsObject(obj, createContainerChain(chain), UPNP_CLASS_CONTAINER);
	}
	//keyword directory in the parent directory to add this function I use the format
	//Keyword-1;Keyword-2;Keyword-3 in the exif tag user comment I also change all letters
	//to lower case and the first letter to upper of every keyword in the script
	//This to avoid getting multiple dirs with Holiday 2007 and holiday 2007. This with
	//the function firstUppperCase(str).
	var keyword=obj.aux['EXIF_TAG_USER_COMMENT'];
	if (keyword)    
	{
		var keywordArray=new Array();
		var keywordArray=obj.aux['EXIF_TAG_USER_COMMENT'].split(';');
		for (i=0;i<keywordArray.length;i++)
		{
			keywordArray[i] = firstUppperCase(keywordArray[i])
			chain = new Array ('-Photo-', 'Keyword', keywordArray[i]);
			// addCdsObject(obj, createContainerChain(chain), UPNP_CLASS_CONTAINER);
		}
	}
	else
	{
		chain = new Array ('-Photo-', 'Keyword','Unknown keyword');
		// addCdsObject(obj, createContainerChain(chain), UPNP_CLASS_CONTAINER);
	}
}
}

// script to turn string to lower case and the first to uppercase
function firstUppperCase(str)
{
var remainChar = str.substring(1);
remainChar = remainChar.toLowerCase();
var firstChar = str.substring(0,1);
firstChar = firstChar.toUpperCase();
return firstChar+remainChar
}

function extractLastDir (str)
{
    var idx;
    idx = str.lastIndexOf("/");
    if (idx > 0)
    {
       str = str.substr (0, idx);
       idx = str.lastIndexOf("/");
       if (idx > 0)
       {
          str = str.substr (idx+1);
          return (str);
       }
       else return ("unknown");
    }
    else return ("unknown"); 
} 

function analyseLastDir (str)
{
    var strArray;
    var strYear;
    var idx;
    
    idx = str.indexOf ("_");
    if (idx > 0)
    {
       strYear = str.substr (0, idx);
       str = str.substr (idx+1);
       str = str.replace(/_/g, " ");
    }
    else strYear='unknown';
    strArray = new Array (strYear, strYear + ': ' + str);
    return (strArray);
}

// import photos ************************************************

// main script part

if (getPlaylistType(orig.mimetype) == '')
{
    var arr = orig.mimetype.split('/');
    var mime = arr[0];
    
    // var obj = copyObject(orig);
    
    var obj = orig; 
    obj.refID = orig.id;
    
    if (mime == 'audio')
    {
        addAudio(obj);
    }
    
    if (mime == 'video')
    {
        addVideo(obj);
    }
    
    if (mime == 'image')
    {
        addImage(obj);
    }

    if (orig.mimetype == 'application/ogg')
    {
        if (orig.theora == 1)
            addVideo(obj);
        else
            addAudio(obj);
    }
}

