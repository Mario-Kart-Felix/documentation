---
title: Debug Caching Issues
description: Learn how to identify and resolve caching issues affecting your Pantheon sites.
categories: [performance]
tags: [cache, cdn, cookies]
contributors: [rachelwhitton, sarahg]
reviewed: "2020-12-15"
---

## Before You Begin

First, verify caching configuration to ensure anonymous caching is enabled. Then test to determine if CDN caching is working on your site:

- To enable anonymous caching within Drupal, see [Drupal Performance and Caching Settings](/drupal-cache).
- WordPress sites on Pantheon have anonymous caching enabled by default. See [WordPress Pantheon Cache Plugin Configuration](/wordpress-cache-plugin) for details.
- See [Testing Global CDN Caching](/test-global-cdn-caching) for steps to test.

If you see `Age: 0` after multiple requests, your site is not caching properly.

### Cache Related Headers

<dl>

<dt ignored>cache-control</dt>

<dd>

Determines caching behaviors for the given request, this configuration is set by WordPress and Drupal.

</dd>

<dt ignored>age</dt>

<dd>

How long the content has been stored in cache. If 0, the response was produced by WordPress or Drupal and not served from cache.

</dd>

<dt ignored>set-cookie</dt>

<dd>

Generated by WordPress or Drupal to send data back to the browser. The platform will not cache a response that contains the `set-cookie` header.

</dd>

</dl>

## Debug Caching Issues

Understand caching behavior for a given page by analyzing cache related HTTP headers from the command line with `curl`. For example:

```bash{outputLines: 2-18}
curl -I https://www.example.com
HTTP/2 200
cache-control: public, max-age=0 // highlight-line
content-type: text/html; charset=UTF-8
server: nginx
x-pantheon-styx-hostname: styx-fe1-a-789d66bff9-tztp6
x-styx-req-id: 7f93c166-53fe-11ea-803e-b26d7703e33f
date: Tue, 08 Dec 2020 16:41:37 GMT
x-served-by: cache-mdw17348-MDW
x-cache: MISS
x-cache-hits: 0
x-timer: S1607445693.448541,VS0,VE4134
vary: Accept-Encoding, Cookie
x-robots-tag: noindex
age: 0 // highlight-line
accept-ranges: bytes
via: 1.1 varnish
content-length: 41278
```

This specific example is from a Drupal site that has anonymous caching enabled, but has "none" set for expiration of cached pages within Drupal's performance settings (`/admin/config/development/performance`). For details, see [Drupal Performance and Caching Settings](/drupal-cache).

### Set-Cookie Headers

Pantheon's platform will not cache a response that contains the `set-cookie` header.

<Alert title="Note" type="info" >

Do not use curl to debug this scenario. Instead, investigate `set-cookie` issues and fixes from your browser. For instructions, see [Test Global CDN with Browser Headers](/test-global-cdn-caching#test-global-cdn-with-browser-headers). Curl does not handle cookie data in the same way that your browser does, and effectively misrepresents cookie and caching behavior as a result.

</Alert>

Search for instances of the cookie name across the site's codebase and once isolated, edit the cookie name so that is matches the [`STYXKEY[a-zA-Z0-9_-]+` naming convention](/caching-advanced-topics#using-styxkey).

Next, wrap a conditional statement around the `setcookie();` function to check whether the cookie is already defined in the request. The goal of this effort is to send `set-cookie` only on the initial request, and never on subsequent requests. For a code example, see [Working with Cookies on Pantheon](/cookies#cache-varying-cookies).

The initial request will still break through the cache. That's expected, because it would not find anything defined for the cookie. Subsequent requests back to the site should now be served by the cache, as the cookie is already set.

#### Cookie alternatives

Cache-varying `STYXKEY` cookies are generally intended for use with custom code. If you modify a third-party plugin, you'll need to make the same modification after each update. There are many ways to approach this (creating patch files, using Composer scripts, forking a project, etc), but in any case, this adds maintenance overhead.

You may want to consider an alternative module or plugin that does not set cache-busting cookies, or you may be able to implement the same functionality using JavaScript on the front-end of the site.

Pantheon's [Advanced Global CDN](/guides/professional-services/advanced-global-cdn) service may also be a good option if your cookie-setting logic can be moved to the CDN layer. One common use-case for this is [geolocation](/guides/professional-services/advanced-global-cdn#geolocation-based-actions): instead of detecting a visitor's location with PHP code and setting cookies, this information can be fetched much quicker from the edge and passed to the application via an HTTP response header.

### Drupal Config Conflicts

If the `cache-control` header returns `private, must-revalidate` unexpectedly, even after enabling anonymous caching across the site, it's possible that there's a conflicting override somewhere.

- Check `settings.php` files for configuration overrides. For example, maybe there's an existing `$conf['cache']` set to `0` that should be adjusted to `1`.

- Or the conflict could be coming from a contrib module. For example, if the Domain module is in use, check performance for that particular module (e.g., `/admin/structure/domain/view/1/config`), which overrides the site performance config (`/admin/config/development/performance`).

### PHP Sessions

A page that includes a PHP session is always uncacheable. While sessions are generally intended to be used for handling authenticated users, you may see a module, plugin or theme start a session for anonymous traffic as well. This is an application anti-pattern and will make scaling the site for high-traffic extremely difficult, as you won't be able to absorb that traffic at the CDN layer -- it all has to bootstrap Drupal or WordPress.

You can spot PHP session cookies in HTTP headers using curl:

```bash{outputLines: 2-21}
curl -I https://www.example.com
HTTP/2 200
cache-control: public, max-age=600
content-type: text/html; charset=UTF-8
expires: Thu, 19 Nov 1981 08:52:00 GMT
pragma: no-cache
server: nginx
set-cookie: PHPSESSID=6c0cc28a5ff9eaff27e8f86599658b17; expires=Thu, 31-Dec-2020 23:22:24 GMT; Max-Age=2000000; path=/  // highlight-line
strict-transport-security: max-age=300
x-pantheon-styx-hostname: styx-fe1-b-5488d894d8-cbdxk
x-styx-req-id: 6d5e43b1-398e-11eb-b0a0-aeb2e6da99c3
date: Tue, 08 Dec 2020 19:49:05 GMT
x-served-by: cache-mdw17344-MDW
x-cache: MISS
x-cache-hits: 0
x-timer: S1607456945.789723,VS0,VE340
vary: Accept-Encoding, Cookie
x-robots-tag: noindex
age: 0
accept-ranges: bytes
via: 1.1 varnish
```

Once you've found the source of the session, you'll want to remove or deactivate whatever sets it. Storing data about an anonymous visitor can be handled more efficiently in the user's browser; a cache-varying cookie or utilizing [local storage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) is likely a better choice.

For more information, see [WordPress and PHP Sessions](/wordpress-sessions#varnish-or-caching-is-not-working-when-a-plugin-or-theme-that-uses-_sessions-is-enabled).
