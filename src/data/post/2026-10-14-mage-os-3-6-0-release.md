---
title: Mage-OS 3.6.0 – Security Release
excerpt: Ports Adobe's October isolated patch (APSB26-153), whose headline issue is an unauthenticated template injection reaching remote code execution, rated CVSS 10.0. All 3.x users should upgrade.
publishDate: 2026-10-14T18:00:00
draft: false
category: Releases
image: ~/assets/images/blog/2026/New-Mage-OS-Website.png
imageAlt: ''
author: mage-os-team
---

**Mage-OS Distribution 3.6.0** is now available. This is a **security release** and every 3.x installation should upgrade.

It ports Adobe's October isolated patch `249-2026-10-001-CE`, published as [security bulletin APSB26-153](https://helpx.adobe.com/security/products/magento/apsb26-153.html). The headline issue is **CVE-2026-103849**, an **unauthenticated template injection in the email template engine that reaches remote code execution**, rated **CVSS 10.0**. The patch also covers stored XSS in the admin template preview, customer password-hash and reset-token disclosure through API search filters, guest-cart access, an admin WYSIWYG validation bypass, product mass-attribute updates, email address validation and lock-file naming.

Alongside the port, 3.6.0 fixes seven bugs and updates two bundled add-ons.

It is built on the same **Magento Open Source 2.4.9** base as 3.5.0, with no dependency additions, removals or constraint changes and no change to PHP support, so it remains a drop-in upgrade from 3.5.x.

There is **no single-package workaround** for this one. The fix spans `mage-os/framework` as well as the Email, Customer, Persistent and Catalog modules, so upgrading the metapackage is the only supported route.

### Security

Adobe shipped its October bulletin as an isolated patch against fixed version `2.4.9-2026-oct`, so there is no new Magento version equivalent. 3.6.0 tracks Magento Open Source 2.4.9, the same as 3.5.0. We have applied the patch onto the Mage-OS core so you get it through a normal Composer upgrade.

**For the full issue list, CVE identifiers and severity ratings, see [APSB26-153](https://helpx.adobe.com/security/products/magento/apsb26-153.html).**

#### Template injection to RCE — CVE-2026-103849

`Framework\Filter\Template` replaces signature-based deferral of template directives with out-of-band deferral through a new `DeferredDirectiveRegistry`. A directive a child template cannot resolve is now handed to the parent as a registry placeholder rather than as text carrying an embedded signature, so a directive's own output can no longer be mistaken for a deferral instruction by a later pass.

Practically: an attacker who could get content into a template — a style block, an HTML attribute, a CSS `url()` — could previously reach code execution. No admin session was required.

#### Template content validation

A new `Email\Model\Template\Validator` rejects template content that places a `{{...}}` directive inside an HTML attribute value or a CSS `url()` argument resolving to an absolute external target. It now runs over **both** the content field and the styles field on save, replacing a narrower rule that only covered `src`, `href` and `action` in the content field. The admin preview block applies the same validation to request-supplied content, closing a stored XSS path.

#### Customer data exposure

- A new restricted-fields plugin rejects `password_hash`, `rp_token` and `confirmation` as search-criteria filter or sort fields on `CustomerRepositoryInterface::getList()`, across REST, SOAP and GraphQL.
- Reset-password tokens are no longer looked up through the customer repository at all; the lookup filters a customer collection directly, and the old entry point is deprecated.

#### Guest cart access

A guest-cart endpoint may now read a cart that still belongs to a persisted customer only when cart persistence is enabled, the customer is not logged in, the persistent session is active, and its customer id matches the cart's. Every other case falls through to the original guest-cart check.

#### Framework hardening

The patch also reorders entity decoding in `Escaper::escapeXssInUrl()`, rejects quoted local parts in email address validation, teaches the configurable WYSIWYG validator to detect empty HTML comments, nested `<` and NUL bytes while no longer letting a single `<body>` mask other matches, narrows template-syntax detection in the UI component sanitizer, and fixes lock-file handling in `FileLock::cleanupOldLocks()`. The admin product mass-attribute update now keys submitted values by each attribute's canonical code, so an unknown or differently-cased code cannot survive into the saved set.

### Notes for integrators who built on 3.5.0

3.5.0 added Mage-OS-specific hardening around this same attack surface. The new deferral mechanism reworks part of it, so a few things move for anyone who built on that release:

- **Signature-based deferral is retired.** The signing channel it relied on is gone, so there is no signed set left to narrow.
- **Directive output neutralization is retained.** With nothing signing output it now always encodes, which is stricter than before.
- **`deferToParent()` remains public**, so directive processors outside `Template` subclasses keep working.
- **`SignatureProvider` is deprecated for deferral only**, not blanket-deprecated, because the neutralizer still uses it.

Mage-OS also emits a directive unchanged when it defers at the root template, where there is no parent left to resolve it, so an internal `:deferred:<hash>:` placeholder cannot reach rendered email. A regression test covers it.

### Other fixes

- **Sales PDF item rows no longer split across a page break.** Five core item renderers passed a hardcoded shift that made the page-break check fire only in the last 20pt of a page, so an item that did not fit was started anyway and broken mid-block — putting one item's numbers against another item's name. ([#304](https://github.com/mage-os/mageos-magento2/pull/304)) by [@TuVanDev](https://github.com/TuVanDev)
- **Customer grid CSV export no longer fails for customers on the admin website.** The website map omitted the admin website (id 0), so a customer created in the admin aborted the whole export with "Undefined array key 0". ([#344](https://github.com/mage-os/mageos-magento2/pull/344)) by [@TuVanDev](https://github.com/TuVanDev)
- **PayflowPro no longer reports a payment failure for a cart with no Payflow payment.** The resolver sent the merchant "Payment Transaction Failed" notification without confirming the cart had ever entered a Payflow flow. ([#341](https://github.com/mage-os/mageos-magento2/pull/341)) by [@TuVanDev](https://github.com/TuVanDev)
- **Configurable products no longer serve a stale parent from cache on `addChild()`**, which in queue consumers could report "The parent product doesn't have configurable product options" when the database said otherwise. ([#269](https://github.com/mage-os/mageos-magento2/pull/269)) by [@ddevallan](https://github.com/ddevallan)
- **A SalesRule `Subselect` condition no longer matches on a premature partial total.** Two non-overlapping quantity ranges could each match their own partial-sum snapshot when the qualifying quantity was split across more than one line item. ([#350](https://github.com/mage-os/mageos-magento2/pull/350)) by [@DavidLambauer](https://github.com/DavidLambauer)
- **The async sales grid cursor no longer resets to 0**, which could stop orders appearing in the sales grid. Backported from upstream ACP2E-4893. ([#349](https://github.com/mage-os/mageos-magento2/pull/349)) by [@melindash](https://github.com/melindash)
- **The interactive installer can configure OpenSearch HTTP authentication.** `bin/magento install` never collected credentials, so password-protected OpenSearch 2.12+ failed the connection test and installed with auth disabled. ([#348](https://github.com/mage-os/mageos-magento2/pull/348)) by [@ajith107](https://github.com/ajith107)

`CONTRIBUTING.md` now points new contributors at Mage-OS guides, DevDocs, Discord and the in-repo Code of Conduct instead of the Adobe CLA. ([#345](https://github.com/mage-os/mageos-magento2/pull/345)) by [@ajith107](https://github.com/ajith107)

### Upgrade notes

**Customer API search is restricted.** Filtering or sorting a `customerRepository` search by `password_hash`, `rp_token` or `confirmation` now raises an `InputException` across REST, SOAP and GraphQL. This is the intended fix, not a regression. Change any integration that uses those three fields in search criteria before you upgrade — nothing legitimate needs to read them. The restricted list is DI-configurable if you need a different set.

**Email template validation now covers the styles field.** Saving a template whose content *or styles* places a `{{...}}` directive inside an HTML attribute value or a CSS `url()` resolving to an absolute external target is rejected. The styles field was not validated before. Review custom transactional templates that build URLs from directives, and preview them after upgrading.

**Template directive signing is gone.** If you built on the signature-based deferral introduced in 3.5.0, that channel no longer exists; deferral goes through the new registry instead. `deferToParent()` remains public, and directive output neutralization is retained and can still be disabled through DI.

**Guest cart endpoints behave differently with persistent sessions.** If you relied on guest endpoints rejecting a persisted customer's cart outright, or on accepting it unconditionally, test your checkout flow with cart persistence enabled.

**Two validators are stricter.** Email addresses with a quoted local part are now rejected as invalid format, and the WYSIWYG validator rejects empty HTML comments, a nested `<` followed by a tag name, and NUL bytes. Content that previously saved may now be rejected.

### Bundled add-on updates

- **`mage-os/module-rma` 2.4.1 → 2.5.0.** Return periods are now evaluated **per item quantity from the shipment date** rather than from the order date. Unshipped quantities are always returnable, shipped quantities only while the shipment is within the configured window, and bundles shipped separately expire a parent unit only once all components have expired. Expired items appear greyed out and unselectable in the customer, guest (Luma and Hyvä) and admin forms, with the check enforced server side. Return labels are reworded to right-of-withdrawal terminology, translated in the it, de, fr, es and ro i18n files.

  **Review your "Return Period (Days)" setting before upgrading.** Because the law starts the period at delivery, which Magento cannot know, the configuration comment now advises adding your expected delivery time. Leaving the value unchanged effectively extends every return window by your shipping time.

- **`swissup/module-ignition` 1.3.2 → 1.3.4.** Security and robustness fixes, including sensitive-data censoring in reports.

`elgentos/magento2-varnish-extended` stays at 2.0.7 and is now pinned explicitly. Version 2.1.0 registers a console command whose constructor resolves the customer repository eagerly, which queries EAV before the schema exists and so breaks `setup:install` on a fresh database.

Every other bundled add-on carries the same version as in 3.5.0.

### Our foundation

Mage-OS 3.6.0 is built on **Magento Open Source 2.4.9**, the same upstream base as 3.5.0 and every 3.x release before it. For details on the upstream release, see the [Magento Open Source 2.4.9 release notes](https://experienceleague.adobe.com/en/docs/commerce-operations/release/notes/magento-open-source/2-4-9).

The certified stack is unchanged from 3.5.0: PHP 8.4, Composer 2.10.2, MariaDB 11.4, OpenSearch 3, RabbitMQ 4.1, Valkey 8, Varnish 7.7 and nginx 1.28.

There are no dependency additions, removals or constraint changes anywhere in the distribution.

Mage-OS 3.5.0 reaches end of life with this release.

### Thanks to everyone who contributed!

This release was made possible by:

[@ddevallan](https://github.com/ddevallan), [@rhoerr](https://github.com/rhoerr), [@melindash](https://github.com/melindash), [@DavidLambauer](https://github.com/DavidLambauer), [@marcelmtz](https://github.com/marcelmtz), [@SamueleMartini](https://github.com/SamueleMartini), [@TuVanDev](https://github.com/TuVanDev) and [@ajith107](https://github.com/ajith107)

Upstream credit to Adobe for the security patch this release ports, and to Anna Bukatar for the ACP2E-4893 fix we backported.

### How to upgrade

#### Upgrading from an older Mage-OS version

```bash
composer require mage-os/product-community-edition=^3.6 --no-update
composer update
bin/magento setup:upgrade
```

#### Migrating from Adobe Commerce or Magento Open Source

See our [migration guide](/get-started/migration-guide) for detailed instructions on switching to Mage-OS.

We hope you enjoy Mage-OS 3.6.0. As always, please report any issues on [GitHub](https://github.com/mage-os/mageos-magento2/issues) and join the conversation on [Discord](/discord-channel).
