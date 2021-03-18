---
title: Website Migration Service
description: Pantheon's Site Migration Service can help ensure a smooth migration of your existing sites. This doc outlines what you can expect.
tags: [services, migration]
categories: [develop]
reviewed: "2021-02-01"
---

The Website Migration Service offered by [Pantheon Professional Services](/professional-services) helps ensure a smooth migration of your existing sites to Pantheon.

[Contact us](https://pantheon.io/professional-services/website-migrations?docs) to get started.

If you are currently working with Pantheon Professional Services Migrations, reach out to your Migration Engagement Manager via Slack with any questions or concerns.

## Migration Project Scope

Pantheon's goal is to migrate your site to our WebOps platform without any loss of functionality.

### Included in Migrations

For all sites identified in the agreed on Project Requirements, the Migrations Team will:

- Transfer site code, database, and files

- Resync your database and user-uploaded files as a part of the site launch

- Disable unnecessary or unsupported modules and plugins

- Move [redirects](/redirects) from `htaccess` into `settings.php` or `wp-config`

- [Implement known solutions](#implement-known-solutions) to existing incompatibilities (includes up to five hours' worth of work)

- Set up external [SMTP](/smtp) to work with the provider of your choice

- Implement [cron](/drupal-cron) triggering services, via New Relic (on any non-Basic plan site)

- Configure sites that use Acquia Search to use Pantheon Solr instead

  - Review our documentation on [known limitations](/solr#known-limitations-of-pantheons-solr-service) first

- Ensure your site is configured for [HTTPS](/https) at launch or as soon as the domain certificates have been provisioned

- Additional tasks identified in the Project Requirements

#### Implement Known Solutions

Each site migration includes up to **five hours** of the Migration Team's time for researching issues and implementing [known solutions](/modules-plugins-known-issues).

These hours are tracked by the Migration Team and do not roll over for use on other sites.

Implementing known solutions includes handling core considerations. For example, if the migration includes:

- Pantheon Default Upstreams

  - Before Pantheon hands the site off to you for User Acceptance Testing (UAT), Pantheon will update the site to use the most current Upstream release.

    - If this causes issues, we will roll it back to the current version on your production server

- Nested Docroot or Composer

  - Your sites will be migrated at their current version

- Custom or Alternative Upstream

  - Your sites will be brought over using the most current release in your upstream

### Out of Scope for Site Migrations

1. Sites not listed in the original migrations agreement

   - Contact your Account Rep to migrate more sites.

1. Pantheon may not be able to migrate functionality if the site relies on resources that are not available on the platform, such as:

   - Issues that arise as a result of:

     - [Pantheon platform considerations](/platform-considerations)

     - Plugins or Modules that have been identified as [problematic](/modules-plugins-known-issues/)

   - Code that relies on specific:
  
     - PHP extensions

     - Server packages that are not currently on Pantheon

   - Anything dependent on languages not available on the platform (Java, Python, Perl, etc.)

1. Performance optimization

1. Additional resync of database and files

1. Updating custom or contributed modules and plugins

1. Fixing issues that already existed on the source server

1. Resolving caching issues

   - Pantheon recommends that you [verify Varnish caching](https://varnishcheck.pantheon.io/) on each site

1. Deployment workflow configuration, updates, or changes

1. Preservation of Git history

1. Adding any new functionality that didn't previously exist on the site, which includes:

   - Enabling or disabling S3 or other CDN configurations

   - Switching to Solr from another search platform

1. Any code changes made to the site after the initial migration begins.

   - You may add any code changes to a Multidev and merge them in post-launch, or once you take ownership of the site, move changes in before launch

## Custom Application Service (CAS) Hours

You may elect to purchase CAS hours (four hour minimum) for the Pantheon Migration Team to complete additional work, which can include:

- Creating a Custom Upstream for you

- Creating cron-related custom modules

- Performing additional database or file syncs

- Configuring or decommissioning S3 (existing S3 integrations are fine, this is just for changes to the file structures in the application)

- Ensuring your applications are working with any required Secure Integrations

- Working on your custom or contrib modules and plugins to troubleshoot issues your team is unable to resolve

- Re-configuring your application layer SSO

## Your Responsibilities

1. Provide a site inventory prior to the migration kick-off meeting

1. Join and participate in the dedicated migration support channel that will be provided in Pantheon’s Slack instance

1. Provide the Pantheon Migration Team with necessary access to current host or to code, database, and files

1. Initiate a code freeze from the migration's start until the site(s) launch on Pantheon

   - Otherwise you accept responsibility for any code changes made to the source server once migrations have commenced.

1. Perform any User Acceptance Testing (UAT) within the timeline specified by the migrations agreement

1. Communicate content freeze to affected stakeholders

1. Perform DNS cutover within the timeline specified in the migrations agreement
