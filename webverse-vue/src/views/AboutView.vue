<template>
  <div class="about-wrap">
    <div class="about-content">

      <!-- English -->
      <template v-if="locale !== 'zh-CN'">
        <h1>About WebVerse</h1>
        <p class="updated">The global directory for websites & tools</p>

        <section>
          <h2>What is WebVerse?</h2>
          <p>WebVerse is a curated global directory of the world's best websites, apps, and digital tools. We hand-pick and catalog 12,000+ quality resources across categories including AI, design, development, productivity, video, education, finance, gaming, and more — so you can discover the right tool for every task without the noise.</p>
        </section>

        <section>
          <h2>Our Mission</h2>
          <p>The internet is vast and constantly growing. Discovering truly useful, high-quality tools among the noise is harder than ever. WebVerse exists to solve that problem: we curate, categorize, and describe every tool in depth so that whether you're a developer, designer, student, or business owner, you can find exactly what you need — fast.</p>
        </section>

        <section>
          <h2>What We Offer</h2>
          <ul>
            <li><strong>Comprehensive Coverage</strong> — 12,000+ tools spanning AI, design, developer, productivity, video, news, e-commerce, gaming, education, finance, social, and security categories.</li>
            <li><strong>AI-Powered Search</strong> — Describe your need in plain language and our AI assistant surfaces the most relevant tools instantly.</li>
            <li><strong>Real Rankings</strong> — Daily-updated heat rankings based on visits, saves, and ratings reveal the most popular tools right now.</li>
            <li><strong>New Tools Feed</strong> — Be the first to discover freshly launched websites and apps from around the world.</li>
            <li><strong>Bilingual Support</strong> — Full English and Chinese (Simplified) interface to serve users worldwide.</li>
            <li><strong>Free to Use</strong> — No account required. Save favorites directly in your browser.</li>
          </ul>
        </section>

        <section>
          <h2>How We Curate</h2>
          <p>Every tool listed on WebVerse is manually reviewed for quality, relevance, and usefulness. We evaluate tools based on their functionality, user adoption, design quality, and the value they provide to real users. We don't accept payment for inclusion — our listings reflect genuine editorial judgment.</p>
          <p>Tool descriptions are written by our editorial team to give you a meaningful understanding of what each tool does, who it's for, and how it compares to alternatives — not just a one-line tagline.</p>
        </section>

        <section>
          <h2>Submit a Tool</h2>
          <p>Know a great website or app that isn't listed yet? We welcome community contributions. Use the <strong>Submit Site</strong> button in the navigation to suggest a tool for review. Our team evaluates all submissions and adds approved tools to the directory.</p>
        </section>

        <section>
          <h2>Contact Us</h2>
          <p>Have feedback, a partnership inquiry, or a question? We'd love to hear from you. Reach out through the Submit Site form and include your message — we read every submission.</p>
        </section>
      </template>

      <!-- 中文 -->
      <template v-else>
        <h1>关于 WebVerse</h1>
        <p class="updated">全球网站与工具精选目录</p>

        <section>
          <h2>什么是 WebVerse？</h2>
          <p>WebVerse 是一个精心策划的全球优质网站、应用与数字工具目录。我们人工筛选并收录了 12,000+ 个优质资源，涵盖 AI、设计、开发、效率、视频、教育、金融、游戏等多个类别——让你无需在海量信息中费力搜寻，随时找到每个场景下最合适的工具。</p>
        </section>

        <section>
          <h2>我们的使命</h2>
          <p>互联网浩如烟海，每天都有新的网站和工具涌现。在这片信息洪流中找到真正好用、高质量的工具越来越难。WebVerse 的存在正是为了解决这个问题：我们精选、分类并深度描述每一款工具，无论你是开发者、设计师、学生还是企业主，都能快速找到所需。</p>
        </section>

        <section>
          <h2>我们提供什么</h2>
          <ul>
            <li><strong>全面覆盖</strong> — 收录 12,000+ 工具，涵盖 AI、设计、开发、效率、视频、资讯、电商、游戏、教育、金融、社交、安全等 12 大类别。</li>
            <li><strong>AI 智能搜索</strong> — 用自然语言描述你的需求，AI 助手即刻为你推荐最相关的工具。</li>
            <li><strong>真实热度排行</strong> — 基于访问量、收藏数和评分每日更新的热度榜单，实时呈现最受欢迎的工具。</li>
            <li><strong>新工具速报</strong> — 第一时间发现全球新上线的网站与应用，紧跟前沿趋势。</li>
            <li><strong>双语支持</strong> — 完整的中英文双语界面，服务全球用户。</li>
            <li><strong>完全免费</strong> — 无需注册账号，收藏记录直接保存在浏览器本地。</li>
          </ul>
        </section>

        <section>
          <h2>我们如何筛选</h2>
          <p>WebVerse 收录的每一款工具都经过人工审核，综合评估其功能实用性、用户认可度、设计质量和实际价值。我们不接受付费收录——所有收录均基于真实的编辑判断。</p>
          <p>每款工具的介绍由我们的编辑团队撰写，旨在让你真正了解工具的功能、适用人群及与同类产品的差异，而不只是一句空洞的宣传语。</p>
        </section>

        <section>
          <h2>提交工具</h2>
          <p>发现了一个优质网站或应用但还未在 WebVerse 收录？我们欢迎社区贡献。点击导航栏中的<strong>提交网站</strong>按钮提交你的推荐，我们会逐一审核并将通过的工具添加至目录。</p>
        </section>

        <section>
          <h2>联系我们</h2>
          <p>如有反馈、合作咨询或任何问题，欢迎随时与我们联系。通过提交网站表单留言，我们会认真阅读每一条提交内容。</p>
        </section>
      </template>

    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
const { locale } = useI18n()
</script>

<style scoped>
.about-wrap {
  max-width: 800px;
  margin: 0 auto;
  padding: 60px 32px 80px;
  position: relative;
  z-index: 1;
}
.about-content h1 {
  font-size: 32px;
  font-weight: 800;
  margin-bottom: 8px;
  letter-spacing: -1px;
}
.updated {
  color: var(--muted);
  font-size: 13px;
  margin-bottom: 48px;
}
section { margin-bottom: 36px; }
h2 {
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 12px;
  color: var(--accent1);
}
p, li {
  font-size: 14px;
  color: #a0a0b0;
  line-height: 1.8;
  margin-bottom: 10px;
}
ul { padding-left: 20px; }
li { margin-bottom: 6px; }
a { color: var(--accent1); text-decoration: none; }
a:hover { opacity: 0.8; }
</style>
