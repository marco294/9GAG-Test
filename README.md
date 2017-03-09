# 9gag
It is a web application developed by **Node.js, Express.js, Redis and Angular.js**.

## Setup Instruction

## Backend
In Node.js, I used [ioredis](https://github.com/luin/ioredis) for handling redis data.
And the redis data is stored in free storage space provided by Redis Labs + AWS.

There are two type of HTTP request in this app.

1. The HTTP GET request to get the sorted list of ids in array according to the GET request parameter.

2. The HTTP POST request to get the posts details in array according to the array of ids provided in POST request body.

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

## Redis Data Structure
The Redis data stored in different format for implementing the sorting and pagination functions.

At the beginning, the Redis database has **1 list** and **200 hashes**.

1. List has **key='posts'** and **value= 200 posts_id**.

2. Hash has **key=post_id** and 8/9 fields which are created_time, caption, comments, url, type, images, likes, id and videos(depends on the type is video or not).

If the user request sort the post according to a criteria, the list will be sorted according to user option and temporarily stored in DB as a new list. This can highly increase the efficiency of retrieving the sorted list as the DB can directly return the temporarily sorted list if it is existed in DB.
To keep the database clean, that list will be set an **expire timer** with 300 seconds. Therefore, the list will be deleted after timer expired.

## Known Issue

## Future expected improvement

## Reference

1. AngularJS ngInfiniteScroll: https://sroze.github.io/ngInfiniteScroll/index.html

2. Redis Labs: https://app.redislabs.com/

3. ioredis: https://github.com/luin/ioredis

4. bootstrap-select: https://silviomoreto.github.io/bootstrap-select/
