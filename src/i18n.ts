// All human-readable copy, EN + JA. Rendered statically (EN) at build time and
// swapped at runtime by src/scripts/app.ts. Data drawn from public reporting on
// php2shell (CVE-2026-109618 / CVE-2026-109619); see README for sources.

export type Lang = 'en' | 'ja';

export const content: Record<Lang, Record<string, any>> = {
  en: {
    _label: '日本語',
    badge: 'ZERO-DAY · AWARENESS',
    crit: 'CVSS v4.0 9.2 · CRITICAL',
    h1: 'One plain POST,<br>and PHP is <span class="g">theirs</span>.',
    sub: 'No upload form. No login. A single ordinary HTTP&nbsp;POST is reported to run code on nearly <span class="hot">every server running PHP</span>. That is php2shell. This page exists so you patch before it reaches you.',
    statusHead: 'patch status · 2026-10-21 14:00 UTC release',
    stats: [
      ['9.2', 'CVSS v4.0', ''],
      ['unauth', 'no login required', '(reported)'],
      ['PHP 5.4+', 'claimed impact', 'cool'],
      ['~15 min', 'patch-diff to mass exploit', 'cool'],
    ],
    preBig: 'T− {t} to patch',
    preNote:
      'PHP ships an out-of-cycle security release at <b>14:00 UTC, 2026-10-21</b> for 8.2 / 8.3 / 8.4 / 8.5. Have your update staged now. The gap between patch and weaponisation is expected to be tiny.',
    postBig: 'PATCH IS LIVE · UPDATE NOW',
    postNote:
      'The fix is out. Sansec expects <b>mass exploitation within ~15 minutes</b> of release, because diffing the patch reveals the bug. Every unpatched PHP server is now a target. Update immediately.',
    liveTag: 'live',

    pmKicker: 'URGENT BROADCAST',
    pmTitle: 'Even the Prime Minister told you to patch tonight.',
    pmName: 'Sanae Takaichi',
    pmHandle: '@takaichi_sanae',
    pmMonogram: 'ST',
    pmBody:
      'An urgent request for tonight.<br><br>PHP’s security team has issued an advisory about two critical vulnerabilities in PHP, which is used by a great many websites.<br><br>Please check whether your public sites use PHP, and prepare to apply the fix released tonight at 23:00 JST as quickly as possible.<br><br>If applying it promptly is difficult, temporarily taking the site offline is one effective way to reduce risk.<br><br>Our national cyber office is posting related information on its X account too, so please refer to that as well.',
    pmTime: '9:55 PM · Oct 21, 2026',
    pmViews: '3.24M views',
    pmViewOn: 'View on X',
    pmQuip:
      'When the head of government announces your maintenance window, “I’ll get to it after lunch” stops being a plan. <b>23:00 JST = 14:00 UTC</b>, the same clock ticking at the top of this page. That night, “emergency maintenance” out-trended the pop charts.',

    nmWhy: "Why it's different",
    whyH: '“We’re not affected” doesn’t hold here.',
    whyLead:
      'An ordinary web shell is the story of one vulnerable app getting one file dropped in it. php2shell is different. The flaw is reported to live in <b>PHP itself</b>, with no special feature and no risky setting required. If your site runs PHP, you’re in scope.',
    why: [
      [
        '01 · core flaw',
        'Not a plugin. PHP itself.',
        'It isn’t a bug in some WordPress plugin or one framework. It’s reported in the PHP interpreter, so it <b>doesn’t care what your site is built with</b>.',
      ],
      [
        '02 · default on',
        'No special setup needed',
        'The suspected code path, <code>session.upload_progress</code>, has been <b>on by default since PHP 5.4</b>. Nobody has to misconfigure anything for it to apply.',
      ],
      [
        '03 · unauthenticated',
        'No login, no upload field',
        'Even a site with no upload feature can be reached by <b>a POST to any PHP endpoint</b>. “We blocked uploads” does not save you.',
      ],
      [
        '04 · whole ecosystem',
        'Shown across major CMS and frameworks',
        'Leaked footage reportedly showed it working on WordPress, Drupal, Joomla, Magento, Laravel, Symfony, MediaWiki, phpBB and WHMCS.',
      ],
    ],

    nmHow: 'How it works',
    howH: 'In plain terms. No recipe.',
    howLead:
      'You don’t need exploit details to grasp why this is bad. Here is the shape of it, at a level that informs defenders without handing anyone a weapon.',
    howCaution:
      'Mechanism below is high-level and based on leaked info / researcher analysis. PHP has not published root-cause details (as of 2026-10-21). No reproduction steps are shown here.',
    how: [
      [
        'Reached through',
        'PHP’s upload-progress handling',
        'PHP has a built-in feature that reports how far an upload has got. The flaw is reported to sit in that code path, and it’s active by default, so ordinary requests can reach it.',
        'entry',
      ],
      [
        'The bug class',
        'A memory-safety flaw (use-after-free)',
        'Internal bookkeeping is reported to reuse a piece of memory after it was already released. That “use-after-free” is the classic kind of bug that can be steered into running attacker code.',
        'defect',
      ],
      [
        'The payoff',
        'Code execution as the web user',
        'The end result is remote code execution: commands run as the PHP / web-server process. From there: read secrets and DB credentials, pivot inward, drop a persistent shell.',
        'impact',
      ],
    ],

    nmSeq: 'Attack sequence',
    seqH: 'What an intrusion actually looks like.',
    seqLead:
      'From the attacker’s side, it’s a routine. Watch the stages they walk through, and what you lose at each one. This is the consequence, not a how-to.',
    seqDamage: 'what you lose',
    attackSeq: [
      [
        'Recon',
        'You’re found by a scanner, not a person',
        'Attackers mass-scan the internet for servers in the vulnerable PHP range. Nobody singled you out; your address simply matched.',
        'Targeted automatically, at internet scale.',
      ],
      [
        'Break in',
        'One ordinary request, no alarm',
        'A single normal-looking POST reaches the core flaw. No login, no upload form, and little that reads as “an attack” in your app logs.',
        'Code now runs on your box as the web user.',
      ],
      [
        'Grip',
        'Your server starts taking their commands',
        'With code execution, the machine answers to them. They read your application source, its configuration and its environment.',
        'Source, config and secrets exposed.',
      ],
      [
        'Loot',
        'Secrets walk out the door',
        'Database credentials, API keys, session secrets and customer records are collected and quietly sent out.',
        'Data breach. Credentials stolen.',
      ],
      [
        'Pivot',
        'The blast spreads inward',
        'Stolen credentials and internal reach let them move to the database, internal services and neighbouring hosts, their traffic dressed as normal web requests.',
        'The breach spreads past the web server.',
      ],
      [
        'Persist',
        'They stay, even after you patch',
        'A hidden backdoor is left behind, and ransomware may be staged. Closing the hole does not evict someone already inside.',
        'Lingering access, ransom, downtime.',
      ],
    ],

    nmExp: 'Exposure check',
    expH: 'Are you exposed?',
    expLead:
      'Pick your situation. This is a quick orientation, not a scan. When in doubt, assume exposed and patch.',
    expQ1: 'Your PHP branch',
    expQ2: 'WAF / Cloudflare filtering multipart POST?',
    verOpts: [
      ['8.5', '8.5'],
      ['8.4', '8.4'],
      ['8.3', '8.3'],
      ['8.2', '8.2'],
      ['8.1 or older', 'eol'],
      ['not sure', 'unknown'],
    ],
    wafOpts: [
      ['yes', 'yes'],
      ['no', 'no'],
      ['not sure', 'unknown'],
    ],
    levelLabels: { crit: 'CRITICAL', high: 'HIGH', guard: 'SHIELDED' },
    verdicts: {
      eol: [
        'crit',
        'Critical, and no patch is coming',
        'Your branch is end-of-life. The 2026-10-21 release covers only 8.2 to 8.5, so <b>8.1, 8.0, 7.x and 5.x get no fix</b>. A WAF rule only buys time.',
        'Upgrade to a supported, patched branch (8.2+) now. This is the single most urgent item on your list.',
      ],
      supportedPre: [
        'high',
        'High. Patch the moment it lands.',
        'Your branch (PHP {v}) gets a fix at 14:00 UTC on 2026-10-21. Until it’s applied you’re exposed; interim filtering helps but is not a cure.',
        'Stage the update now. The instant the release is out, apply it. Meanwhile, filter multipart POSTs at the edge and disable <code>session.upload_progress</code>.',
      ],
      supportedPost: [
        'high',
        'High. The fix is out, apply it immediately.',
        'Your branch (PHP {v}) has a fix as of 14:00 UTC 2026-10-21. Every unpatched minute counts: mass exploitation is expected within ~15 minutes of release.',
        'Update to the latest {v}.x patch release right now, then confirm the running version. Keep edge filtering on until you’ve verified.',
      ],
      guardPre: [
        'guard',
        'Partly shielded, but patch is still the fix',
        'Edge filtering of multipart POSTs can blunt early attempts, which buys time. It is <b>not</b> a substitute for the patch: filters get bypassed.',
        'Keep the filter on, then apply the 14:00 UTC release as soon as it’s out. Verify the version afterwards.',
      ],
      guardPost: [
        'guard',
        'Shield up. Now finish the job.',
        'Your edge filter helps, but the real fix shipped at 14:00 UTC. Relying on a WAF alone against a core RCE is a losing bet over time.',
        'Apply the official patch now, verify the running PHP version, and leave the filter in place as defence-in-depth.',
      ],
      unknown: [
        'high',
        'Treat as exposed until proven otherwise',
        'If you’re unsure of your version or protection, assume the worst: a default PHP install in the claimed range is reportedly reachable with no special conditions.',
        'Find your PHP version (<code>php -v</code> / your host panel), then follow the supported-branch or EOL path above. Don’t wait to be certain.',
      ],
    },

    nmTl: 'The race',
    tlH: 'Leaked early. Patched late. Exploited fast.',
    tlLead:
      'What makes php2shell frightening isn’t only the bug. It’s the timeline. Details got out before the fix, turning disclosure into a sprint.',
    tl: [
      [
        '2026-10-20',
        '~2 days early',
        false,
        'Details leak',
        'Information leaked ahead of coordinated disclosure. PHP issues an advance notice; CERT-EU publishes Security Advisory 2026-018.',
      ],
      [
        '2026-10-21',
        '14:00 UTC',
        true,
        'Out-of-cycle security release',
        'PHP ships fixes for 8.2, 8.3, 8.4 and 8.5. End-of-life branches get nothing.',
      ],
      [
        '2026-10-21',
        '+~15 min',
        true,
        'Weaponisation window',
        'Sansec expects mass exploitation within minutes: comparing the patched code with the old reveals exactly where the bug was.',
      ],
      [
        '2026-10-22',
        'original date',
        false,
        'Planned disclosure',
        'The coordinated disclosure date the leak jumped ahead of. Early exploitation attempts were already reported (e.g. by Cloudflare) before this.',
      ],
    ],

    nmMx: 'Blast radius',
    mxH: 'Who gets a patch, and who doesn’t.',
    mxLead:
      'Fixes land only for currently-supported branches. If you’re on anything older, there is no fix, only an upgrade.',
    mxHead: ['PHP branch', 'Patch 2026-10-21', 'Action'],
    mx: [
      ['8.5', 'ok', 'Patched', 'Update to the latest 8.5 release'],
      ['8.4', 'ok', 'Patched', 'Update to the latest 8.4 release'],
      ['8.3', 'ok', 'Patched', 'Update to the latest 8.3 release'],
      ['8.2', 'ok', 'Patched', 'Update to the latest 8.2 release'],
      ['8.1', 'eol', 'No fix (EOL)', 'Upgrade to 8.2+ immediately'],
      ['8.0 / 7.x / 5.x', 'eol', 'No fix (EOL)', 'Upgrade to a supported branch'],
    ],
    mxTargetsLead: 'Reportedly demonstrated against, among others:',
    targets: [
      'WordPress',
      'Drupal',
      'Joomla',
      'Magento',
      'Laravel',
      'Symfony',
      'MediaWiki',
      'phpBB',
      'WHMCS',
    ],

    nmDef: 'Defense',
    defH: 'Patch, filter, upgrade. In that order.',
    defLead:
      'Perfect detection is hard; removing the precondition is stronger. The priority is simple: get onto a patched version. Everything else buys time until you do.',
    mythX: '✕ Myth',
    mythP:
      '<b>“Disable system() or use a WAF and you’re fine.”</b> Not here. This is a memory-safety bug in PHP’s core, so <code>disable_functions</code> is irrelevant, and CSP is for client-side (XSS), not a server-side core RCE. A WAF filter helps for hours; the patch is the fix.',
    def: [
      [
        '01',
        'Patch to a fixed release',
        'Primary',
        'Update to the 2026-10-21 release for your branch (8.2 / 8.3 / 8.4 / 8.5), then confirm with <code>php -v</code>. This is the only real cure.',
        true,
      ],
      [
        '02',
        'Filter multipart POST at the edge',
        '',
        'Until patched, block or heavily restrict <code>multipart/form-data</code> POSTs at a WAF / Cloudflare. Emergency rules exist as a stopgap, not a replacement for patching.',
        false,
      ],
      [
        '03',
        'Disable upload-progress tracking',
        '',
        'If you can’t patch instantly, set <code>session.upload_progress.enabled=0</code> in php.ini, a targeted mitigation if the reported root cause holds. Re-test your apps.',
        false,
      ],
      [
        '04',
        'Upgrade anything end-of-life',
        '',
        '8.1, 8.0, 7.x and 5.x receive no fix. If you’re on them, an upgrade is the mitigation; there is no patch to wait for.',
        false,
      ],
      [
        '05',
        'Watch for post-exploitation',
        '',
        'Alert on the web process spawning a shell, unfamiliar child processes, or new files in web dirs. Right after the patch is public is when scanning spikes.',
        false,
      ],
      [
        '06',
        'Verify, don’t assume',
        '',
        'Confirm the running PHP version on every host: containers, legacy VMs, that one forgotten box. Fleets fail where a single unpatched server hides.',
        false,
      ],
    ],

    footLead:
      '<b>php2shell-anatomy</b> is an awareness page explaining a fresh PHP zero-day (CVE-2026-109618 / CVE-2026-109619) so people patch in time. Built for defenders.',
    footDisc:
      'No exploit code, payloads or reproduction steps are included, by design. Technical claims are drawn from public reporting and may change once PHP publishes its official advisory. Verify against php.net before acting.',
  },

  ja: {
    _label: 'EN',
    badge: 'ゼロデイ · 注意喚起',
    crit: 'CVSS v4.0 9.2 · 緊急',
    h1: 'ただのPOSTで、<br>PHPは<span class="g">奪われる</span>。',
    sub: 'アップロード欄も、ログインも要らない。何の変哲もないHTTP&nbsp;POST一発で、<span class="hot">PHPが動くほぼ全サーバー</span>でコードが走る、とされる。それが php2shell。手遅れになる前にパッチを当ててほしくて、このページを作った。',
    statusHead: 'パッチ状況 · 2026-10-21 14:00 UTC リリース',
    stats: [
      ['9.2', 'CVSS v4.0', ''],
      ['未認証', 'ログイン不要', '（とされる）'],
      ['PHP 5.4+', '影響主張', 'cool'],
      ['約15分', '差分から大規模悪用', 'cool'],
    ],
    preBig: 'パッチまで T− {t}',
    preNote:
      'PHPは <b>2026-10-21 14:00 UTC</b> に 8.2 / 8.3 / 8.4 / 8.5 向けの緊急リリースを出す。更新準備は今のうちに。パッチ公開から武器化までの猶予はごく短いと見られている。',
    postBig: 'パッチ公開済み · 今すぐ更新を',
    postNote:
      '修正は出た。Sansecは公開から<b>約15分で大規模悪用</b>が始まると予測している。パッチ差分から穴の場所が割れるからだ。未適用のPHPサーバーは全て標的。直ちに更新を。',
    liveTag: 'live',

    pmKicker: '緊急放送',
    pmTitle: '首相まで「今夜パッチ当てて」と言ってくる脆弱性。',
    pmName: '高市早苗',
    pmHandle: '@takaichi_sanae',
    pmMonogram: '高',
    pmBody:
      '皆様に、今夜に対応して頂きたい大至急のお願いです。<br><br>多くのウェブサイトで使用されているPHPに関し、PHPのセキュリティチームが、重大な2件の脆弱性に関する注意喚起を行っています。<br><br>公開しているウェブサイトでPHPを使用しているか確認し、今夜、10月21日午後11時（日本時間）に公開される修正パッチについて、可及的速やかに適用できるよう準備をお願いします。<br><br>修正パッチを速やかに適用することが困難な場合は、例えばウェブサイト等を一時的に停止させることも、リスクを低減させるための有効策の一つと考えられます。<br><br>国家サイバー統括室のXアカウントでも関係する情報を発信していますので、そちらも参考にして下さい。',
    pmTime: '午後9:55 · 2026年10月21日',
    pmViews: '324.2万 views',
    pmViewOn: 'Xで見る',
    pmQuip:
      '政府のトップにメンテ時刻を告知される脆弱性。「昼メシのあとで」はもう通用しない。<b>日本時間 今夜23:00 = 14:00 UTC</b>、このページ上部と同じ時計だ。その夜のXトレンドは、新曲より「緊急メンテ」が上に来た。',

    nmWhy: 'なぜ桁違いか',
    whyH: '「うちは関係ない」が通じない。',
    whyLead:
      '普通のWebシェルは「脆弱なアプリに1ファイル置かれる」話。php2shell は違う。穴は <b>PHPそのもの(コア)</b> にあるとされ、特別な機能も危険な設定も要らない。PHPで動くサイトは原則みんな射程に入る。',
    why: [
      [
        '01 · コアの穴',
        'プラグインでなく、PHP本体',
        'WordPressプラグインや特定フレームワークの不具合ではない。PHPインタプリタ側の問題とされ、<b>何で作られたサイトかを問わない</b>。',
      ],
      [
        '02 · デフォルト有効',
        '特別な設定は要らない',
        '疑われる経路 <code>session.upload_progress</code> は <b>PHP 5.4以降デフォルトで有効</b>。危険な設定をしていなくても成立しうる。',
      ],
      [
        '03 · 未認証',
        'ログインもアップロード欄も不要',
        'アップロード機能が無いサイトでも、<b>任意のPHPエンドポイントへのPOST</b>で届きうる。「アップロードを塞いだ」では守れない。',
      ],
      [
        '04 · エコシステム全域',
        '主要CMS/FWで実証',
        'リーク動画では WordPress・Drupal・Joomla・Magento・Laravel・Symfony・MediaWiki・phpBB・WHMCS での動作が示されたと報じられている。',
      ],
    ],

    nmHow: '仕組み',
    howH: '平たく言うと。手順は出さない。',
    howLead:
      '深刻さを理解するのに攻撃手順は要らない。防御側に役立つ範囲で、武器を渡さずに「形」だけ示す。',
    howCaution:
      '以下の仕組みは高レベルの説明で、リーク情報・研究者分析に基づく。PHP公式は根本原因を未公表(2026-10-21時点)。再現手順は一切載せていない。',
    how: [
      [
        '届く経路',
        'PHPのアップロード進捗処理',
        'PHPにはアップロードの進み具合を報告する組み込み機能がある。穴はそのコード経路にあるとされ、デフォルト有効なので普通のリクエストでも届きうる。',
        'entry',
      ],
      [
        'バグの種類',
        'メモリ安全性の不具合(use-after-free)',
        '内部処理が、いったん解放したメモリを再び使ってしまうと報じられている。この「解放後使用」は、攻撃者のコード実行へ誘導されうる典型的なバグ。',
        'defect',
      ],
      [
        '行き着く先',
        'Webユーザ権限でのコード実行',
        '最終的に到達するのはリモートコード実行。PHP/Webプロセスの権限でコマンドが走り、そこから機密やDB認証情報の窃取、内部への横移動、恒久的なシェル設置へ。',
        'impact',
      ],
    ],

    nmSeq: '攻撃シーケンス',
    seqH: '侵入は、こうして進む。',
    seqLead:
      '攻撃者の側から見れば、ただの手順だ。彼らが通る段階と、その各段であなたが何を失うのかを見てほしい。手順書ではなく、結末の話。',
    seqDamage: '失うもの',
    attackSeq: [
      [
        '偵察',
        '狙われるのは「あなた」ではない。スキャナに拾われる。',
        '攻撃者は脆弱なPHP帯のサーバーをインターネット全体で一斉スキャンする。誰かに選ばれたのではなく、あなたのアドレスが条件に一致しただけ。',
        'ネット規模で自動的に標的化される。',
      ],
      [
        '侵入',
        'ごく普通のリクエスト1発、警報は鳴らない',
        '正常に見えるPOSTがコアの穴に届く。ログインもアップロード欄も不要で、アプリのログに「攻撃らしさ」はほとんど残らない。',
        'Webユーザ権限でサーバー上にコードが走る。',
      ],
      [
        '掌握',
        'サーバーは、彼らの命令を聞くようになる',
        'コード実行を得た時点で、箱は攻撃者に応答する。アプリのソース、設定、環境変数が読まれる。',
        'ソース・設定・機密が露出。',
      ],
      [
        '略奪',
        '秘密が、そのまま持ち出される',
        'DB認証情報、APIキー、セッション秘密、顧客データが収集され、ひそかに外部へ送られる。',
        '情報漏洩。認証情報の窃取。',
      ],
      [
        '横展開',
        '被害は、内側へ広がる',
        '盗んだ認証情報と内部到達性で、DBや内部サービス、隣のホストへ移動する。通信は通常のWebリクエストに偽装される。',
        '被害がWebサーバーの外へ拡大。',
      ],
      [
        '居座り',
        'パッチを当てても、居座られる',
        '隠しバックドアが残され、ランサムウェアが仕込まれることもある。穴を塞いでも、既に入った者は追い出せない。',
        '潜伏・身代金・サービス停止。',
      ],
    ],

    nmExp: '露出チェック',
    expH: 'あなたは露出している？',
    expLead:
      '状況を選ぶと、ざっくりの方向付けが出る(スキャンではない)。迷ったら「露出している」前提でパッチを。',
    expQ1: 'PHPのブランチ',
    expQ2: 'WAF/Cloudflareで multipart POST を制限している？',
    verOpts: [
      ['8.5', '8.5'],
      ['8.4', '8.4'],
      ['8.3', '8.3'],
      ['8.2', '8.2'],
      ['8.1以前', 'eol'],
      ['不明', 'unknown'],
    ],
    wafOpts: [
      ['はい', 'yes'],
      ['いいえ', 'no'],
      ['不明', 'unknown'],
    ],
    levelLabels: { crit: '緊急', high: '高', guard: '遮蔽' },
    verdicts: {
      eol: [
        'crit',
        '緊急。しかもパッチは来ない。',
        'あなたのブランチはEOL。2026-10-21のリリースは 8.2〜8.5 のみで、<b>8.1・8.0・7.x・5.x には修正が出ない</b>。WAFルールは時間稼ぎにしかならない。',
        'サポート対象(8.2+)へ今すぐアップグレードを。あなたのリストで最優先の項目。',
      ],
      supportedPre: [
        'high',
        '高。出た瞬間に当てる。',
        'あなたのブランチ(PHP {v})は 2026-10-21 14:00 UTC に修正が出る。適用まで露出は続く。暫定フィルタは助けになるが治療ではない。',
        '更新を今から準備。リリースされた瞬間に適用を。それまでは multipart POST をエッジで制限し、<code>session.upload_progress</code> を無効化。',
      ],
      supportedPost: [
        'high',
        '高。修正は出た。直ちに適用を。',
        'あなたのブランチ(PHP {v})は 14:00 UTC 時点で修正済み。未適用の1分1分が致命的。公開から約15分で大規模悪用が見込まれる。',
        '最新の {v}.x パッチへ今すぐ更新し、稼働版を確認。検証が済むまでエッジのフィルタは維持を。',
      ],
      guardPre: [
        'guard',
        '一部は遮蔽。だが治すのはパッチ。',
        'multipart POST のエッジ制限は初期の試行を鈍らせ、時間を稼げる。ただしパッチの<b>代わりにはならない</b>。フィルタは回避される。',
        'フィルタは維持しつつ、14:00 UTC のリリースを出たらすぐ適用。適用後に版を検証。',
      ],
      guardPost: [
        'guard',
        '遮蔽あり。だが仕上げを。',
        'エッジのフィルタは有効だが、本当の修正は 14:00 UTC に出た。コアRCEにWAF頼みは長期的に負ける賭け。',
        '公式パッチを今すぐ適用し、稼働PHP版を検証。フィルタは多層防御として残す。',
      ],
      unknown: [
        'high',
        '確証が持てないなら露出扱い',
        '版も防御も不明なら最悪を想定。主張されている範囲のデフォルト構成は、特別な条件なしで届きうるとされる。',
        'まず PHP の版を確認(<code>php -v</code> / ホスト管理画面)。その上で上のサポート対象／EOLの手順へ。確証を待たない。',
      ],
    },

    nmTl: '時間との競走',
    tlH: '早くリーク、遅れて修正、速攻で悪用。',
    tlLead:
      'php2shell の怖さはバグだけじゃない。タイムラインだ。修正前に情報が出回り、ディスクロージャが短距離走になった。',
    tl: [
      [
        '2026-10-20',
        '約2日早く',
        false,
        '情報リーク',
        '協調ディスクロージャの前に情報が流出。PHPが事前告知、CERT-EUが Security Advisory 2026-018 を公開。',
      ],
      [
        '2026-10-21',
        '14:00 UTC',
        true,
        '緊急セキュリティリリース',
        'PHPが 8.2・8.3・8.4・8.5 向けに修正を公開。EOLブランチには何も出ない。',
      ],
      [
        '2026-10-21',
        '+約15分',
        true,
        '武器化の窓',
        'Sansecは数分で大規模悪用が始まると予測。修正版と旧コードを比べれば穴の場所が割れる。',
      ],
      [
        '2026-10-22',
        '本来の予定日',
        false,
        '予定されていた公開日',
        'リークが先回りした協調ディスクロージャ日。これ以前に早期の悪用試行が既に報告されている(Cloudflare等)。',
      ],
    ],

    nmMx: '影響範囲',
    mxH: 'パッチが来る版、来ない版。',
    mxLead:
      '修正はサポート中のブランチにしか出ない。それより古ければ修正は無く、残る道はアップグレードだけ。',
    mxHead: ['PHPブランチ', '2026-10-21 パッチ', '取るべき行動'],
    mx: [
      ['8.5', 'ok', '修正あり', '最新の 8.5 リリースへ更新'],
      ['8.4', 'ok', '修正あり', '最新の 8.4 リリースへ更新'],
      ['8.3', 'ok', '修正あり', '最新の 8.3 リリースへ更新'],
      ['8.2', 'ok', '修正あり', '最新の 8.2 リリースへ更新'],
      ['8.1', 'eol', '修正なし(EOL)', '今すぐ 8.2+ へアップグレード'],
      ['8.0 / 7.x / 5.x', 'eol', '修正なし(EOL)', 'サポート対象ブランチへ移行'],
    ],
    mxTargetsLead: 'とりわけ、以下などで実証されたと報じられている:',
    targets: [
      'WordPress',
      'Drupal',
      'Joomla',
      'Magento',
      'Laravel',
      'Symfony',
      'MediaWiki',
      'phpBB',
      'WHMCS',
    ],

    nmDef: '防御',
    defH: '当てる、絞る、上げる。この順で。',
    defLead:
      '完璧な検知は難しい。前提を消すほうが強い。優先順位は単純。まずパッチ版へ。他は全部、それまでの時間稼ぎ。',
    mythX: '✕ 誤解',
    mythP:
      '<b>「system() を止める／WAFを入れれば平気」</b>。ここでは違う。これはPHPコアのメモリ安全性バグなので <code>disable_functions</code> は無関係、CSPはクライアント側(XSS)向けでサーバー側のコアRCEには無力。WAFは数時間の時間稼ぎ。治すのはパッチ。',
    def: [
      [
        '01',
        '修正版へパッチ',
        '最優先',
        '自分のブランチ(8.2 / 8.3 / 8.4 / 8.5)の 2026-10-21 リリースへ更新し、<code>php -v</code> で確認。唯一の本当の治療。',
        true,
      ],
      [
        '02',
        'multipart POST をエッジで制限',
        '',
        'パッチ前は WAF/Cloudflare で <code>multipart/form-data</code> POST を遮断・強く制限。緊急ルールが暫定策として存在するが、パッチの代替ではない。',
        false,
      ],
      [
        '03',
        'アップロード進捗追跡を無効化',
        '',
        '即時パッチが無理なら php.ini で <code>session.upload_progress.enabled=0</code>。報じられた根本原因が正しければ的を絞った緩和になる。アプリを再テスト。',
        false,
      ],
      [
        '04',
        'EOL版は上げる',
        '',
        '8.1・8.0・7.x・5.x には修正が出ない。使っているならアップグレードが唯一の緩和。待つべきパッチが無い。',
        false,
      ],
      [
        '05',
        '侵入後の兆候を監視',
        '',
        'Webプロセスがシェルを起動、見慣れぬ子プロセス、Webディレクトリの新規ファイルにアラート。パッチ公開直後こそスキャンが急増する。',
        false,
      ],
      [
        '06',
        '思い込まず、検証する',
        '',
        '全ホストで稼働PHP版を確認。コンテナ、旧VM、忘れられた1台。艦隊は、未適用の1台が隠れている所から破られる。',
        false,
      ],
    ],

    footLead:
      '<b>php2shell-anatomy</b> は、新しいPHPのゼロデイ(CVE-2026-109618 / CVE-2026-109619)を手遅れになる前に塞いでもらうための注意喚起ページ。防御側のために作った。',
    footDisc:
      '攻撃コード・ペイロード・再現手順は意図的に一切含めていない。技術的記述は公開報道に基づき、PHP公式アドバイザリ公開後に変わりうる。対応前に php.net で確認を。',
  },
};
