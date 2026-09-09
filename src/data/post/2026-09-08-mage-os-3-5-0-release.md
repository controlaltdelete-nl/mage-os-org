---
title: Mage-OS 3.5.0 – Emergency Security Release
excerpt: Ports Adobe's hotfix for StyleSmuggler (CVE-2026-75650, CVSS 10.0), an unauthenticated RCE exploited in the wild since 4 September. Upgrade immediately — and read the remediation steps, because patching alone is not enough.
publishDate: 2026-09-08T20:00:00
draft: false
category: Releases
image: ~/assets/images/blog/2026/New-Mage-OS-Website.png
imageAlt: ''
author: mage-os-team
---

**Mage-OS Distribution 3.5.0** is now available. This is an **emergency security release** and every 3.x installation should upgrade immediately.

It ports Adobe's `VULN-39341` hotfix for **StyleSmuggler** — [CVE-2026-75650](https://nvd.nist.gov/vuln/detail/CVE-2026-75650), CVSS 10.0, published as [security bulletin APSB26-146](https://helpx.adobe.com/security/products/magento/apsb26-146.html) — an **unauthenticated remote code execution** vulnerability affecting every Magento Open Source and Adobe Commerce version from 2.4.4 through 2.4.9. It also adds a layer of defense-in-depth hardening around the same attack surface, applies Adobe's September isolated patch `249-2026-09-001-CE` ([security bulletin APSB26-138](https://helpx.adobe.com/security/products/magento/apsb26-138.html)), and fixes four bugs.

It is built on the same **Magento Open Source 2.4.9** base as 3.4.0, with no dependency additions or removals and no change to PHP support, so it remains a drop-in upgrade from 3.4.x.

**Please read the remediation section before you treat this as done.** [Sansec](https://sansec.io/research/stylesmuggler-0day), who discovered and reported the vulnerability, observed exploitation beginning **4 September 2026** — three days before Adobe published a fix — against stores that were fully patched at the time. Upgrading closes the hole. It does nothing about access an attacker may already have obtained.

### Security

Adobe ships this fix as a `vendor/`-level hotfix rather than as a tagged Magento release, so there is no new Magento version equivalent. 3.5.0 tracks Magento Open Source 2.4.9, the same as 3.4.0. We have applied the patch onto the Mage-OS core so you get it through a normal Composer upgrade.

#### StyleSmuggler — CVE-2026-75650

The exploit chain is multi-stage: an attacker first plants PHP into a file the application will later read (typically a failure report), then triggers evaluation of that content through the transactional email template pipeline. No admin session and no user interaction are required.

Sansec reports multiple unrelated threat actors with rapidly evolving payloads, and in observed cases two distinct groups leaving different backdoors on the same store.

What changed in Mage-OS:

- **Grid row `UrlGeneratorFactory`** now validates that the requested generator implements `GeneratorInterface` *before* instantiation, so a gadget class's constructor arguments are never resolved.
- **Email and Newsletter admin preview blocks** require the matching ACL resource before rendering a request-driven preview.
- **`Email\Model\AbstractTemplate`** string-coerces `setTemplateText()` and `setTemplateStyles()`, so structured data cannot reach the template filter.
- **`View\Element\BlockFactory`** resolves the DI preference and validates the resulting type against `BlockInterface` before instantiation.
- **`Webapi\ErrorProcessor` and `pub/errors/processor.php`** prefix generated error reports with an execution guard and neutralize PHP open tags in report data.

#### Additional protection specific to Mage-OS

Because StyleSmuggler was exploited before it was patched, and because the underlying pattern — attacker-influenced content reaching a template evaluation path — has produced repeated findings in this area, 3.5.0 adds three hardening layers on top of Adobe's fix. This is additional protection specific to Mage-OS; it is not part of Adobe's patch.

- **A block directive policy.** The `{{block}}` directive now checks the requested class against a restricted-class policy, and re-checks the class actually instantiated. The deny list is configurable through DI.
- **Directive output neutralization.** Resolved directive output is neutralized so a later filtering pass cannot re-parse it, closing the class of bug where a directive's *result* is treated as a new template.
- **Template include-path validation.** A new `SecurePathValidator` anchors template include paths to the application root.

#### September isolated patch — APSB26-138

Adobe's September scheduled bulletin, [APSB26-138](https://helpx.adobe.com/security/products/magento/apsb26-138.html), shipped as the isolated patch `249-2026-09-001-CE`. It includes [CVE-2026-77111](https://nvd.nist.gov/vuln/detail/CVE-2026-77111), an incorrect-authorization issue leading to a security feature bypass, rated CVSS 8.7. **For the full issue list, CVE identifiers and severity ratings, see [APSB26-138](https://helpx.adobe.com/security/products/magento/apsb26-138.html).**

It contributes seven further fixes, including an ACL bypass in the admin backup rollback controller, path traversal and arbitrary file deletion in the ImportExport export-file controller, an IDOR in InstantPurchase address loading, a quote-ownership check in PayPal Express checkout, an XSS in the admin order-create screen, and a double-encoding bypass in `Escaper::escapeXssInUrl()`.

### Patching is not the whole remediation

If your store was reachable between 4 and 7 September, treat it as potentially compromised until you have evidence otherwise.

1. **Upgrade to 3.5.0.** This closes the vulnerability. It does nothing about access already obtained.

2. **Scan for implants.** [Sansec's StyleSmuggler write-up](https://sansec.io/research/stylesmuggler-0day) documents the observed payloads and what to look for. Start there. They will probably change over time.

3. **Rotate the encryption key and every credential it protected** — admin passwords, API and integration tokens, payment credentials and SSH keys — reissued **at their source**. Rotating the encryption key re-encrypts stored values; it does not change them at the payment gateway, the API provider or the remote host, and it does not invalidate anything an attacker has already read.

Step 3 is the one that matters most.

### Other fixes

- **The Weee item price renderer no longer divides by zero** when `qty_ordered` is 0. ([#329](https://github.com/mage-os/mageos-magento2/pull/329)) by [@TuVanDev](https://github.com/TuVanDev)
- **The persistent quote cleanup cron no longer loops indefinitely**, and its batches are bounded. ([#333](https://github.com/mage-os/mageos-magento2/pull/333)) by [@TuVanDev](https://github.com/TuVanDev)
- **On-the-fly image regeneration works for images with no media gallery row.** It previously failed silently. ([#336](https://github.com/mage-os/mageos-magento2/pull/336)) by [@emetik](https://github.com/emetik)
- **`MockCreationTrait::createPartialMockWithReflection()` no longer fatals** on interfaces declaring more abstract methods than the test requested. ([#332](https://github.com/mage-os/mageos-magento2/pull/332)) by [@ProxiBlue](https://github.com/ProxiBlue)

### Upgrade notes

**Email template previews now require explicit ACL resources.** An admin role with access to the email or newsletter template grids but without `Magento_Email::template`, `Magento_Newsletter::template` or `Magento_Newsletter::queue` will see an empty preview instead of rendered output. Those resources already exist in earlier versions — they simply were not enforced on the preview blocks — so you can grant them explicitly before upgrading.

**`{{block}}` directives in email templates are checked against a restricted-class policy.** Templates that instantiate a block class the policy rejects will render that directive as empty. Standard blocks and the `frontend` area are unaffected. If you have custom transactional email templates referencing unusual block classes, preview them after upgrading.

**Resolved directive output is no longer re-parsed by later filter passes.** If you rely on a custom filter that deliberately emits template syntax from one directive for a later pass to evaluate, that indirection no longer happens.

**Template include paths are validated against the application root.** Custom template engines or deployment layouts that render templates from outside the application root will need those paths brought inside it.

### Bundled add-on updates

Two bundled add-ons moved in this release:

- **`mage-os/module-automatic-translation` 2.2.1 → 2.3.1.** `url_key` values are now generated with Magento's translit filter for non-Latin target languages, and the OpenAI translator moved to the Chat Completions API. Stores using the OpenAI translator should verify translation still works after upgrading.
- **`elgentos/magento2-varnish-extended` 2.0.6 → 2.0.7.** xkey purge tags are normalized to whitespace-separated form. Review any custom VCL that parses xkey tags.

Every other bundled add-on carries the same version as in 3.4.0.

### Our foundation

Mage-OS 3.5.0 is built on **Magento Open Source 2.4.9**, the same upstream base as 3.4.0, 3.3.0, 3.2.0, 3.1.0 and 3.0.0. For details on the upstream release, see the [Magento Open Source 2.4.9 release notes](https://experienceleague.adobe.com/en/docs/commerce-operations/release/notes/magento-open-source/2-4-9).

The certified stack is unchanged from 3.4.0: PHP 8.4, Composer 2.10.2, MariaDB 11.4, OpenSearch 3, RabbitMQ 4.1, Valkey 8, Varnish 7.7 and nginx 1.28.

There are no dependency additions, removals or constraint changes anywhere in the distribution.

Mage-OS 3.4.0 reaches end of life with this release.

### Thanks to everyone who contributed!

This release was made possible by:

[@rhoerr](https://github.com/rhoerr), [@TuVanDev](https://github.com/TuVanDev), [@emetik](https://github.com/emetik), [@ProxiBlue](https://github.com/ProxiBlue), [@marcelmtz](https://github.com/marcelmtz), [@pingiun](https://gist.github.com/pingiun)

With thanks to [@michielgerritsen](https://github.com/michielgerritsen) for reviewing the hardening work under time pressure, and to Damien Retzinger, Daniel Sloof, Rick Bouma and Tihomir Vranješ for their help with the analysis.

Upstream credit to Adobe for the security patches this release ports, and to [Sansec](https://sansec.io/research/stylesmuggler-0day) for discovering StyleSmuggler and reporting it.

### How to upgrade

#### Upgrading from an older Mage-OS version

```bash
composer require mage-os/product-community-edition=^3.5 --no-update
composer update
bin/magento setup:upgrade
```

#### Migrating from Adobe Commerce or Magento Open Source

See our [migration guide](/get-started/migration-guide) for detailed instructions on switching to Mage-OS.

We hope you enjoy Mage-OS 3.5.0. As always, please report any issues on [GitHub](https://github.com/mage-os/mageos-magento2/issues) and join the conversation on [Discord](/discord-channel).
