var request = require('request');

// getIGJSON is a recursive function that getting the IG posts from http://www.instagram.com/9gag/media/
// one call can get the 20 newest posts from IG
// First param define how many times to call the function
// Second param define whether there are error during the getting processes
// Third param store the array of all posts (with details)
// Fourth param store '?max_id=last_post_id' for getting the next 20 posts in IG by using http://www.instagram.com/9gag/media/?max_id=last_post_id
// Fifth param is a callback function to return data
module.exports = function getIGJSON(i, err, ajson, nextid, callback){
  // if numbe of times to call function is <= 0
  if(i<=0){
    // use callback function to return data
    callback(err, ajson);
  }
  // Otherwise
  else{
    // create a HTTP request to get the 20 IG posts details in JSON format from http://www.instagram.com/9gag/media/
    request(
        {
          method: 'GET',
          uri: 'http://www.instagram.com/9gag/media/'+ nextid,
          // Noted that the respose need to unzip from gzip format
          gzip: true
        }
        // get the body data when receive response
      , function (error, response, body) {
          // parse the body data to JSON object
          var items = JSON.parse(body).items;
          // items should contail 20 posts data store in an array
          // loop through each post
          items.forEach(obj => {
            // if the type is video, store one more video field for video url
            if(obj.type=="video"){
                // Directly push the formatted data into ajson array
                ajson.push ({
                  id: obj.id,
                  link: obj.link,
                  type: obj.type,
                  created_time: obj.created_time,
                  images: obj.images.standard_resolution.url,
                  comments: obj.comments.count,
                  likes: obj.likes.count,
                  caption: obj.caption.text,
                  video: obj.videos.standard_resolution.url
                });
            }
            else {
              // Directly push the formatted data into ajson array
              ajson.push ({
                id: obj.id,
                link: obj.link,
                type: obj.type,
                created_time: obj.created_time,
                images: obj.images.standard_resolution.url,
                comments: obj.comments.count,
                likes: obj.likes.count,
                caption: obj.caption.text,
              });
            }
          });
          // Decrement i
          i=i-1;
          // Determine nextid as the last post id store in ajson
          // Use it to get next 20 posts from IG by using http://www.instagram.com/9gag/media/?max_id=last_post_id
          var nextid = '?max_id='+ ajson[ajson.length-1].id;
          // Call itself recursivly
          getIGJSON(i, error, ajson, nextid, callback);
      }
    );
  }
}
