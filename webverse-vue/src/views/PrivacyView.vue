<template>
  <div class="privacy-wrap">
    <div class="privacy-content">

      <!-- English -->
      <template v-if="locale !== 'zh-CN'">
        <h1>Privacy Policy</h1>
        <p class="updated">Last updated: May 2026</p>

        <section>
          <h2>1. Overview</h2>
          <p>WebVerse ("we", "us", or "our") operates the website at nav.vux-framework-admin.com. This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our service.</p>
        </section>

        <section>
          <h2>2. Information We Collect</h2>
          <p>We do not require account registration. The only data we store locally in your browser is:</p>
          <ul>
            <li>Your preferred language setting</li>
            <li>Your saved favorite tools (stored in browser localStorage only)</li>
          </ul>
          <p>We do not collect, store, or transmit any personally identifiable information to our servers.</p>
        </section>

        <section>
          <h2>3. Cookies &amp; Advertising</h2>
          <p>We use <strong>Google AdSense</strong> to display advertisements. Google AdSense uses cookies to serve ads based on your prior visits to this website and other websites. You may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener">Google Ads Settings</a>.</p>
          <p>Third-party vendors, including Google, use cookies to serve ads based on your prior visits to our website and/or other sites on the Internet.</p>
        </section>

        <section>
          <h2>4. AI Search Feature</h2>
          <p>When you use the AI-powered search, your query is sent to <strong>DeepSeek</strong>'s API to generate recommendations. We do not store these queries. Please review <a href="https://www.deepseek.com/privacy" target="_blank" rel="noopener">DeepSeek's Privacy Policy</a> for details.</p>
        </section>

        <section>
          <h2>5. Third-Party Links</h2>
          <p>Our website contains links to third-party websites. We are not responsible for their privacy practices or content.</p>
        </section>

        <section>
          <h2>6. Children's Privacy</h2>
          <p>Our service does not address anyone under the age of 13. We do not knowingly collect personally identifiable information from children.</p>
        </section>

        <section>
          <h2>7. Changes to This Policy</h2>
          <p>We may update our Privacy Policy from time to time. Changes are effective when posted on this page.</p>
        </section>

        <section>
          <h2>8. Contact</h2>
          <p>If you have any questions about this Privacy Policy, please contact us through the website.</p>
        </section>
      </template>

      <!-- 中文 -->
      <template v-else>
        <h1>隐私政策</h1>
        <p class="updated">最后更新：2026 年 5 月</p>

        <section>
          <h2>1. 概述</h2>
          <p>WebVerse（以下简称"我们"）运营 nav.vux-framework-admin.com 网站。本页面说明我们在您使用服务时收集、使用和披露个人数据的政策。</p>
        </section>

        <section>
          <h2>2. 我们收集的信息</h2>
          <p>我们不要求用户注册账号。我们仅在您的浏览器本地存储以下数据：</p>
          <ul>
            <li>您的语言偏好设置</li>
            <li>您收藏的工具列表（仅存储在浏览器 localStorage 中）</li>
          </ul>
          <p>我们不会向服务器收集、存储或传输任何个人身份信息。</p>
        </section>

        <section>
          <h2>3. Cookie 与广告</h2>
          <p>我们使用 <strong>Google AdSense</strong> 展示广告。Google AdSense 使用 Cookie 根据您之前访问本网站及其他网站的记录投放广告。您可以访问 <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener">Google 广告设置</a> 退出个性化广告。</p>
          <p>包括 Google 在内的第三方供应商使用 Cookie，根据您对本网站及其他网站的访问记录展示广告。</p>
        </section>

        <section>
          <h2>4. AI 搜索功能</h2>
          <p>当您使用 AI 搜索功能时，您的查询内容将发送至 <strong>DeepSeek</strong> API 以生成推荐结果。我们不存储这些查询内容。详情请查阅 <a href="https://www.deepseek.com/privacy" target="_blank" rel="noopener">DeepSeek 隐私政策</a>。</p>
        </section>

        <section>
          <h2>5. 第三方链接</h2>
          <p>本网站包含指向第三方网站的链接。我们对这些网站的内容及隐私政策不承担任何责任。</p>
        </section>

        <section>
          <h2>6. 儿童隐私</h2>
          <p>本服务不面向 13 岁以下未成年人。我们不会有意收集儿童的个人身份信息。</p>
        </section>

        <section>
          <h2>7. 政策变更</h2>
          <p>我们可能会不定期更新隐私政策。更新后的内容在本页面发布时即时生效。</p>
        </section>

        <section>
          <h2>8. 联系我们</h2>
          <p>如您对本隐私政策有任何疑问，请通过网站与我们联系。</p>
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
.privacy-wrap {
  max-width: 800px;
  margin: 0 auto;
  padding: 60px 32px 80px;
  position: relative;
  z-index: 1;
}
.privacy-content h1 {
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
@media (max-width: 600px) {
  .privacy-wrap { padding: 40px 16px 60px; }
}
</style>
