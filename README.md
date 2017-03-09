# 9GAG Web Test
It is a web application developed by **Node.js, Express.js, Redis and Angular.js**.

## Setup Instruction

Prerequisite: Installed [Node.js](https://nodejs.org/en/download/), so that you can run npm. 

1. Clone the file

2. cd 9GAG-Test

3. npm install

4. npm start

5. http://localhost:3000/ to use the app

## Backend
In Node.js, I used [ioredis](https://github.com/luin/ioredis) for handling redis data.
And the redis data is stored in free storage space provided by Redis Labs.

There are two type of HTTP request in this app.

1. The HTTP GET request to get the sorted list of ids in array according to the GET request parameter.

2. The HTTP POST request to get the posts details in array according to the array of ids provided in POST request body.

### Instagram Posts
models/pullIGposts.js contain a function to fetch 9GAG Instagram posts through http://www.instagram.com/9gag/media/. The link can only get recent 20 posts. However, if we add '?max_id=last_post_id' to the last part of the url, it can get the next 20 posts in IG. 

Uncomment line 36-86 in app.js to update the Redis DB with 200 recent posts of 9GAG Instagram

## Frontend
The frontend veiw used simple bootstrap css and [bootstrap-select](https://silviomoreto.github.io/bootstrap-select/) for select list.

**Pagination** is maintained at frontend.

1. At the beginning, the HTTP GET request will be sent to server to get the list of 200 posts id sorted by created_time.

2. Indicate how many posts have been load by index, starting at 0.

3. Using HTTP POST with an array of ids, get the next 9 posts details.

4. Load that 9 posts details into view and display it.

The **infinite scroll view** used ngInfiniteScroll.

1. The load post details HTTP POST request will be sent when user scroll to the bottom and load more posts data into the view.

2. The request will not fire when the previous request is still running.

3. The scroll will disabled when there are no more id in that sorted id list.

There are two **custom directives** created to special display view in AngularJS.

1. Relative Time directive
   
   It was used to display the post created time relative from the current time, e.g 2 days ago. And click on the time will link to the original post.
   
2. Caption Analysis directive

  It was used to analysis whether a string of caption contain '@' or '#'. It will add an url to the tag which will connect it to the corresponding official IG link. 

## Redis Data Structure
The Redis data stored in different format for implementing the sorting and pagination functions.

At the beginning, the Redis database has **1 list** and **200 hashes**.

1. List has **key='posts'** and **value= 200 posts_id**.

2. Hash has **key=post_id** and 8/9 fields which are created_time, caption, comments, url, type, images, likes, id and videos(depends on the type is video or not).

If the user request sort the post according to a criteria, the list will be sorted according to user option and temporarily stored in DB as a new list. This can highly increase the efficiency of retrieving the sorted list as the DB can directly return the temporarily sorted list if it is existed in DB.

To keep the database clean, that list will be set an **expire timer** with 300 seconds. Therefore, the list will be deleted after timer expired.

## Known Issues

1. The relative created time is close to the official IG post time, but not exactly same with the official IG post.

2. Not support the new multi-photo function in IG

## Future expected improvement

1. Solve the known issues

2. Add the new function: Click to view enlarged photo

3. Customizing video playing bar with better contolling

4. UI layout improvement

## Reference

1. AngularJS ngInfiniteScroll: http://sroze.github.io/ngInfiniteScroll/index.html

2. Redis: http://redis.io/

3. Redis Labs: http://app.redislabs.com/

4. ioredis: http://github.com/luin/ioredis

5. bootstrap-select: http://silviomoreto.github.io/bootstrap-select/

6. 9GAG Instagram: http://www.instagram.com/9gag

