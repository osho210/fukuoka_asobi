const {
    defineConfig
} = require("cz-git");

module.exports = defineConfig({
    rules: {
        // @see: https://commitlint.js.org/#/reference-rules
    },
    prompt: {
        alias: {
            fd: "docs: fix typos"
        },
        messages: {
            type: "変更の種類を選択してください:",
            scope: "この変更の対象範囲を入力してください（任意）:",
            customScope: "この変更の対象範囲を入力してください:",
            subject: "変更内容を短く、命令形で記述してください:\n",
            body: '変更内容の詳細を記述してください。:\n',
            breaking: '破壊的変更があれば記載してください。:\n',
            footerPrefixesSelect: "この変更に関連するISSUESの種類を選択してください（任意）:",
            customFooterPrefix: "ISSUESのプレフィックスを入力してください:",
            footer: "この変更に関連するISSUESを記載してください。例: #31, #34:\n",
            generatingByAI: "AIによるコミットメッセージを生成中...",
            generatedSelectByAI: "AIが生成した件名から適切なものを選択してください:",
            confirmCommit: "上記の内容でコミットしてもよろしいですか？",
        },
        types: [
            {
                value: "graphql",
                name: "graphql:  🥅  GraphQL関連の変更",
                emoji: "🥅",
            },
            {
                value: "feat",
                name: "feat:     ✨  新機能の追加",
                emoji: "✨",
            },
            {
                value: "fix",
                name: "fix:      🐛  バグ修正",
                emoji: "🐛"
            },
            {
                value: "docs",
                name: "docs:     📝  ドキュメントのみの変更",
                emoji: "📝",
            },
            {
                value: "style",
                name: "style:    💄  コードに影響しない変更",
                emoji: "💄",
            },
            {
                value: "refactor",
                name: "refactor: ♻️   バグ修正や機能追加を伴わないリファクタリング",
                emoji: "♻️",
            },
            {
                value: "perf",
                name: "perf:     ⚡️  パフォーマンス改善",
                emoji: "⚡️",
            },
            {
                value: "test",
                name: "test:     ✅  テスト追加・修正",
                emoji: "✅",
            },
            {
                value: "build",
                name: "build:    📦️  ビルドシステムや外部依存関係の変更",
                emoji: "📦️",
            },
            {
                value: "ci",
                name: "ci:       🎡  CI設定ファイルやスクリプトの変更",
                emoji: "🎡",
            },
            {
                value: "chore",
                name: "chore:    🔨  その他、srcやtestファイルを変更しない作業",
                emoji: "🔨",
            },
            {
                value: "revert",
                name: "revert:   ⏪️  以前のコミットの取り消し",
                emoji: "⏪️",
            },
            {
                value: "setting",
                name: "setting:  ⚙️   設定変更",
                emoji: "⚙️",
            }
        ],
        useEmoji: true,
        emojiAlign: "center",
        useAI: false,
        aiNumber: 1,
        themeColorCode: "",
        scopes: [],
        allowCustomScopes: true,
        allowEmptyScopes: true,
        customScopesAlign: "bottom",
        customScopesAlias: "custom",
        emptyScopesAlias: "empty",
        upperCaseSubject: false,
        markBreakingChangeMode: false,
        allowBreakingChanges: ["feat", "fix"],
        breaklineNumber: 100,
        breaklineChar: "|",
        skipQuestions: [],
        issuePrefixes: [{
            value: "closed",
            name: "closed:   ISSUES has been processed"
        }, ],
        customIssuePrefixAlign: "top",
        emptyIssuePrefixAlias: "skip",
        customIssuePrefixAlias: "custom",
        allowCustomIssuePrefix: true,
        allowEmptyIssuePrefix: true,
        confirmColorize: true,
        scopeOverrides: undefined,
        defaultBody: "",
        defaultIssues: "",
        defaultScope: "",
        defaultSubject: "",
    },
});