<template>
  <footer>
    <p>
      {{ $t('common.copyright') }} ·
      <RouterLink to="/about">{{ $t('common.aboutUs') }}</RouterLink> ·
      <RouterLink to="/privacy">{{ $t('common.privacyPolicy') }}</RouterLink>
    </p>
  </footer>
</template>

<style scoped>
footer {
  position: relative;
  z-index: 1;
  border-top: 1px solid var(--border);
  padding: 32px;
  text-align: center;
  color: var(--muted);
  font-size: 13px;
}
footer a {
  color: var(--accent1);
  text-decoration: none;
}
footer a:hover { opacity: 0.8; }
</style>
