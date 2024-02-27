# Crawlee Sitemap Error

This is a reproduction repository to show an issue with Crawlee
when using their `RobotsFile` util. When an issue occurs while
decompressing a sitemap file in gzip format, a non-catchable
error is thrown, that crashes the entire application.

The error looks like this:

```
> crawlee-sitemap-error@1.0.0 start
> node index.js

node:events:492
      throw er; // Unhandled 'error' event
      ^

Error: incorrect header check
    at Zlib.zlibOnError [as onerror] (node:zlib:189:17)
Emitted 'error' event on Gunzip instance at:
    at Gunzip.onerror (node:internal/streams/readable:1004:14)
    at Gunzip.emit (node:events:514:28)
    at emitErrorNT (node:internal/streams/destroy:151:8)
    at emitErrorCloseNT (node:internal/streams/destroy:116:3)
    at process.processTicksAndRejections (node:internal/process/task_queues:82:21) {
  errno: -3,
  code: 'Z_DATA_ERROR'
}

Node.js v20.10.0
```

When changing the internals of crawlee like this:

```diff
// ./node_modules/@crawlee/utils/internals/robots.js
- stream = stream.pipe(createGunzip());
+ stream = stream.pipe(createGunzip()).on('error', reject);
```

The sitemap is correctly identified as "malformed":

```
> crawlee-sitemap-error@1.0.0 start
> node index.js

WARN  Malformed sitemap content: https://7even.de/web/sitemap/shop-1/sitemap-1.xml
WARN  Malformed sitemap content: https://7even.de/web/sitemap/shop-9/sitemap-1.xml
WARN  Malformed sitemap content: https://7even.de/web/sitemap/shop-8/sitemap-1.xml
WARN  Malformed sitemap content: https://7even.de/web/sitemap/shop-7/sitemap-1.xml
WARN  Malformed sitemap content: https://7even.de/web/sitemap/shop-6/sitemap-1.xml
WARN  Malformed sitemap content: https://7even.de/web/sitemap/shop-5/sitemap-1.xml
[]
```
