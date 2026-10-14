---
title: Mage-OS 3.6.0 – Security Release
excerpt: Security Port of Adobe's October isolated patch (APSB26-153). This release includes fixes for security issues rated CVSS 10.0. All 3.x users should upgrade.
publishDate: 2026-10-14T18:00:00
draft: false
category: Releases
image: ~/assets/images/blog/2026/New-Mage-OS-Website.png
imageAlt: ''
author: mage-os-team
---

**Mage-OS Distribution 3.6.0** is now available. This is a **security release** and every Mage-OS 3.x installation should upgrade.

This release ports Adobe's October isolated patch `249-2026-10-001-CE`, published as [security bulletin APSB26-153](https://helpx.adobe.com/security/products/magento/apsb26-153.html). This release includes critical fixes for:

 - **CVE-2026-103849**, an **unauthenticated template injection in the email template engine that reaches remote code execution**, rated **CVSS 10.0**. 
 
The patch also covers stored XSS in the admin template preview, customer password-hash and reset-token disclosure through API search filters, guest-cart access, an admin WYSIWYG validation bypass, product mass-attribute updates, email address validation and lockfile naming.

In addition to the security changes, 3.6.0 fixes seven bugs and updates two bundled add-ons.

Mage-OS 3.6.0 is built on the same **Magento Open Source 2.4.9** base as 3.5.0, with no new dependency additions, removals or constraint changes and no change to PHP support. It remains a drop-in upgrade from 3.5.x.

### Security

**For the full corrected security issue list, CVE identifiers and severity ratings, see [APSB26-153](https://helpx.adobe.com/security/products/magento/apsb26-153.html).**

#### Template injection to RCE — CVE-2026-103849

This release changes `Framework\Filter\Template`. `Framework\Filter\Template` now replaces signature-based deferral of template directives with out-of-band deferral through a new `DeferredDirectiveRegistry`. A directive a child template cannot resolve is now handed to the parent as a registry placeholder rather than as text carrying an embedded signature. The entire "signing" process of deferred directives has been removed. 

Without this fix, an attacker can leverage a [StyleSmuggler](https://sansec.io/research/stylesmuggler-0day) like exploit to achieve remote-code-execution on a Mage-OS store. 

#### Template content validation

A new `Email\Model\Template\Validator` rejects template content that places a `{{...}}` directive inside an HTML attribute value or a CSS `url()` argument resolving to an absolute external target. It now runs over **both** the content field and the styles field on save. Previously, this only covered `src`, `href` and `action` in the content field. 

#### Customer data exposure

A new restricted-fields plugin rejects `password_hash`, `rp_token` and `confirmation` as search-criteria filter or sort fields on `CustomerRepositoryInterface::getList()`, across REST, SOAP and GraphQL.

In addition, reset-password tokens are no longer looked up through the customer repository. `Customer\Model\ForgotPasswordToken\GetCustomerByToken` has a known bug that requires type-casting `Customer\Api\CustomerInterface` to `Customer\Model\Customer`, which is a breaking change. `GetCustomerByToken` has been deprecated for some time and is no longer used by the framework. However, if your codebase depends on this class, review that code for potential breakage.

#### Guest cart access

A guest-cart endpoint may now read a cart that still belongs to a persisted customer only when cart persistence is enabled, the customer is not logged in, the persistent session is active, and its customer id matches the cart's. Every other case falls through to the original guest-cart check.

#### Framework hardening

The patch also hardens the framework in various ways, it:
  
  1. Reorders entity decoding in `Escaper::escapeXssInUrl()`
  2. Rejects quoted local parts in email address validation
  3. Teaches the configurable WYSIWYG validator to detect empty HTML comments, nested `<` and NUL bytes while no longer letting a single `<body>` mask other matches
  4. Narrows template-syntax detection in the UI component sanitizer
  5. Fixes lockfile handling in `FileLock::cleanupOldLocks()`. 
  6. The admin product mass-attribute update now keys submitted values by each attribute's canonical code, so an unknown or differently-cased code cannot survive into the saved set

> There is a known bug with [the way in which the lockfile (var/.regenerate.lock) is regenerated.](https://github.com/magento/magento2/issues/41535). If you have a read-only filesystem, please reach out and we'll work with you to get this remediated. There will be a new file, `976bc24c08055e67a58cf491401c8b2f3d48ff55b8092f1ede196bac4756a228`, in the root of your application after regenerations. This file is harmless and can be ignored, we plan to fix this in a future release.

### Other fixes

- **Sales PDF item rows no longer split across a page break.** Five core item renderers passed a hardcoded shift that made the page-break check fire only in the last 20pt of a page, so an item that did not fit was started anyway and broken mid-block — putting one item's numbers against another item's name. ([#304](https://github.com/mage-os/mageos-magento2/pull/304)) by [@TuVanDev](https://github.com/TuVanDev)
- **Customer grid CSV export no longer fails for customers on the admin website.** The website map omitted the admin website (id 0), so a customer created in the admin aborted the whole export with "Undefined array key 0". ([#344](https://github.com/mage-os/mageos-magento2/pull/344)) by [@TuVanDev](https://github.com/TuVanDev)
- **PayflowPro no longer reports a payment failure for a cart with no Payflow payment.** The resolver sent the merchant "Payment Transaction Failed" notification without confirming the cart had ever entered a Payflow flow. ([#341](https://github.com/mage-os/mageos-magento2/pull/341)) by [@TuVanDev](https://github.com/TuVanDev)
- **Configurable products no longer serve a stale parent from cache on `addChild()`**, which in queue consumers could report "The parent product doesn't have configurable product options" when the database said otherwise. ([#269](https://github.com/mage-os/mageos-magento2/pull/269)) by [@ddevallan](https://github.com/ddevallan)
- **A SalesRule `Subselect` condition no longer matches on a premature partial total.** Two non-overlapping quantity ranges could each match their own partial-sum snapshot when the qualifying quantity was split across more than one line item. ([#350](https://github.com/mage-os/mageos-magento2/pull/350)) by [@DavidLambauer](https://github.com/DavidLambauer)
- **The async sales grid cursor no longer resets to 0**, which could stop orders appearing in the sales grid. Backported from upstream ACP2E-4893. ([#349](https://github.com/mage-os/mageos-magento2/pull/349)) by [@melindash](https://github.com/melindash)
- **The interactive installer can configure OpenSearch HTTP authentication.** `bin/magento install` never collected credentials, so password-protected OpenSearch 2.12+ failed the connection test and installed with auth disabled. ([#348](https://github.com/mage-os/mageos-magento2/pull/348)) by [@ajith107](https://github.com/ajith107)

### Bundled add-on updates

- **`mage-os/module-rma` 2.4.1 → 2.5.0.** Return periods are now evaluated **per item quantity from the shipment date** rather than from the order date. Unshipped quantities are always returnable, shipped quantities only while the shipment is within the configured window, and bundles shipped separately expire a parent unit only once all components have expired. Expired items appear greyed out and unselectable in the customer, guest (Luma and Hyvä) and admin forms, with the check enforced server side. Return labels are reworded to right-of-withdrawal terminology, translated in the it, de, fr, es and ro i18n files.

  **Review your "Return Period (Days)" setting before upgrading.** Because the law starts the period at delivery, which Magento cannot know, the configuration comment now advises adding your expected delivery time. Leaving the value unchanged effectively extends every return window by your shipping time.

- **`swissup/module-ignition` 1.3.2 → 1.3.4.** Security and robustness fixes, including sensitive-data censoring in reports.

`elgentos/magento2-varnish-extended` stays at 2.0.7 and is now pinned explicitly as a result of incompatibilities. We will be upgrading to a newer version once fixes are in place.

### Our foundation

For details on the upstream release, see the [Magento Open Source 2.4.9 release notes](https://experienceleague.adobe.com/en/docs/commerce-operations/release/notes/magento-open-source/2-4-9).

There are no infrastructure changes associated with this release.

Additionally, [as per our release policy](https://mage-os.org/product/releases/), Mage-OS 3.5.0 reaches end of life with this release.

### Thanks to everyone who contributed!

This release was made possible by:

[@ddevallan](https://github.com/ddevallan), [@rhoerr](https://github.com/rhoerr), [@melindash](https://github.com/melindash), [@DavidLambauer](https://github.com/DavidLambauer), [@marcelmtz](https://github.com/marcelmtz), [@SamueleMartini](https://github.com/SamueleMartini), [@TuVanDev](https://github.com/TuVanDev), [@ajith107](https://github.com/ajith107), and [@damienwebdev](https://github.com/damienwebdev)

Upstream credit to Adobe for the security patch this release ports, and to [Anna Bukatar](https://github.com/abukatar) for the ACP2E-4893 fix we backported.

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
