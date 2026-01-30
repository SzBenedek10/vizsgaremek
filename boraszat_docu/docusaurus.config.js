// @ts-check
import {themes as prismThemes} from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Borászat Vizsgaremek', 
  tagline: 'Digitális megoldások a borászat számára',
  url: 'https://your-website.com',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'hu', // Átállítva magyarra
    locales: ['hu'],
  },

 presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          routeBasePath: 'docs',
        },
        // Itt állítsd vissza true-ra vagy adj meg opciókat:
        blog: {
          showReadingTime: true,
          blogTitle: 'Borászat Hírek',
          blogDescription: 'Friss hírek a projektről',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: 'img/docusaurus-social-card.jpg',
   navbar: {
  title: 'Borászat Projekt',
  logo: {
    alt: 'Borászat Logo',
    src: 'img/logo.svg',
  },
  items: [
    {
      type: 'docSidebar',
      sidebarId: 'tutorialSidebar',
      position: 'left',
      label: 'Dokumentáció',
    },
    {to: '/blog', label: 'Blog', position: 'left'}, // Csak a Blog maradjon
    {
      href: 'https://github.com/sinthofferbence', 
      label: 'GitHub Repó',
      position: 'right',
    },
  ],
},
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Tartalom',
            items: [
              {
                label: 'Dokumentáció',
                to: '/docs/',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Borászat Vizsgaremek. Built with Docusaurus.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
        // C# kódokhoz fontos:
        additionalLanguages: ['csharp'], 
      },
    }),
};

export default config;