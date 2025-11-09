'use client';

import type React from 'react';
import { createContext, useContext, useEffect, useState } from 'react';

// Define supported languages
export type Language = 'en' | 'es' | 'fr' | 'zh' | 'ar' | 'bn';

// Define the context type
type TranslationsContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  formatDate: (date: string | Date) => string;
  dir: 'ltr' | 'rtl';
};

// Create the context
const TranslationsContext = createContext<TranslationsContextType | undefined>(
  undefined
);

// Define RTL languages
const rtlLanguages: Language[] = ['ar'];

// Define translations directly in the code
const translations: Record<Language, Record<string, string>> = {
  en: {
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.projects': 'Projects',
    'nav.skills': 'Skills',
    'nav.resume': 'Resume',
    'nav.blog': 'Blog',
    'nav.contact': 'Contact',
    'nav.admin': 'Admin',
    'hero.viewProjects': 'View Projects',
    'hero.downloadResume': 'Download Resume',
    'hero.scrollDown': 'Scroll Down',
    'about.title': 'About Me',
    'about.tab.bio': 'Biography',
    'about.tab.journey': 'Professional Journey',
    'about.tab.values': 'Core Values',
    'about.value.passion': 'Passion',
    'about.value.excellence': 'Excellence',
    'about.value.innovation': 'Innovation',
    'about.mission.title': 'My Mission',
    'projects.title': 'Featured Projects',
    'projects.description':
      'A selection of my recent work in software architecture and backend development.',
    'projects.viewAll': 'View All Projects',
    'projects.liveDemo': 'Live Demo',
    'projects.viewCaseStudy': 'View Case Study',
    'projects.caseStudy.overview': 'Overview',
    'projects.caseStudy.process': 'Process',
    'projects.caseStudy.tech': 'Tech Stack',
    'projects.caseStudy.gallery': 'Gallery',
    'projects.caseStudy.challenge': 'Challenge',
    'projects.caseStudy.solution': 'Solution',
    'projects.caseStudy.results': 'Results',
    'projects.caseStudy.viewCode': 'View Code',
    'skills.title': 'Skills',
    'skills.description': 'My technical expertise and proficiency across various technologies, frameworks, and tools.',
    'skills.category.core': 'Core',
    'skills.category.devops': 'DevOps',
    'skills.category.databases': 'Databases',
    'skills.category.learning': 'Learning',
    'testimonials.title': 'What People Say',
    'testimonials.description':
      'Feedback from clients and colleagues about my work and collaboration.',
    'timeline.title': 'Experience & Education',
    'timeline.description':
      'My professional journey and educational background.',
    'blog.title': 'Latest Blog Posts',
    'blog.description':
      'Thoughts and insights on software architecture, backend development, and technology trends.',
    'blog.viewAll': 'View All Posts',
    'blog.readMore': 'Read More',
    'blog.tab.internal': 'My Posts',
    'blog.tab.external': 'External Posts',
    'blog.search': 'Search blog posts...',
    'blog.noResults': 'No posts found matching your search.',
    'contact.title': 'Contact Me',
    'contact.description': "Let's discuss your next project or collaboration opportunity. I'm always open to new challenges.",
    'contact.form.title': 'Get in Touch',
    'contact.form.description':
      "Fill out the form and I'll get back to you as soon as possible.",
    'contact.form.name': 'Name',
    'contact.form.email': 'Email',
    'contact.form.message': 'Message',
    'contact.form.send': 'Send Message',
    'contact.form.sending': 'Sending...',
    'contact.form.success.title': 'Message Sent!',
    'contact.form.success.description':
      "Thank you for reaching out. I'll get back to you as soon as possible.",
    'contact.form.success.button': 'Send Another Message',
    'contact.info.email': 'Email',
    'contact.info.location': 'Location',
    'contact.info.location.value': 'Remote - Available Worldwide',
    'contact.info.social': 'Social Profiles',
    'footer.quickLinks': 'Quick Links',
    'footer.connect': 'Connect',
    'footer.copyright': 'Built with ❤️ using TypeScript, Tailwind, Next.js',
    'footer.rights': 'All rights reserved.',
    'language.en': 'English',
    'language.es': 'Español',
    'language.fr': 'Français',
    'language.zh': '中文',
    'language.ar': 'العربية',
    'language.bn': 'বাংলা',
  },
  es: {
    'nav.home': 'Inicio',
    'nav.about': 'Sobre Mí',
    'nav.projects': 'Proyectos',
    'nav.skills': 'Habilidades',
    'nav.resume': 'Currículum',
    'nav.blog': 'Blog',
    'nav.contact': 'Contacto',
    'nav.admin': 'Admin',
    'hero.viewProjects': 'Ver Proyectos',
    'hero.downloadResume': 'Descargar CV',
    'hero.scrollDown': 'Desplazar Abajo',
    'about.title': 'Sobre Mí',
    'about.tab.bio': 'Biografía',
    'about.tab.journey': 'Trayectoria Profesional',
    'about.tab.values': 'Valores Fundamentales',
    'about.value.passion': 'Pasión',
    'about.value.excellence': 'Excelencia',
    'about.value.innovation': 'Innovación',
    'about.mission.title': 'Mi Misión',
    'projects.title': 'Proyectos Destacados',
    'projects.description':
      'Una selección de mi trabajo reciente en arquitectura de software y desarrollo backend.',
    'projects.viewAll': 'Ver Todos los Proyectos',
    'projects.liveDemo': 'Demo en Vivo',
    'projects.viewCaseStudy': 'Ver Caso de Estudio',
    'projects.caseStudy.overview': 'Resumen',
    'projects.caseStudy.process': 'Proceso',
    'projects.caseStudy.tech': 'Tecnologías',
    'projects.caseStudy.gallery': 'Galería',
    'projects.caseStudy.challenge': 'Desafío',
    'projects.caseStudy.solution': 'Solución',
    'projects.caseStudy.results': 'Resultados',
    'projects.caseStudy.viewCode': 'Ver Código',
    'skills.title': 'Habilidades',
    'skills.description': 'Mi experiencia técnica y competencia en varias tecnologías, frameworks y herramientas.',
    'skills.category.core': 'Principales',
    'skills.category.devops': 'DevOps',
    'skills.category.databases': 'Bases de Datos',
    'skills.category.learning': 'Aprendiendo',
    'testimonials.title': 'Lo Que Dicen de Mí',
    'testimonials.description':
      'Comentarios de clientes y colegas sobre mi trabajo y colaboración.',
    'timeline.title': 'Experiencia y Educación',
    'timeline.description': 'Mi trayectoria profesional y formación académica.',
    'blog.title': 'Últimas Publicaciones',
    'blog.description':
      'Pensamientos y perspectivas sobre arquitectura de software, desarrollo backend y tendencias tecnológicas.',
    'blog.viewAll': 'Ver Todas las Publicaciones',
    'blog.readMore': 'Leer Más',
    'blog.tab.internal': 'Mis Publicaciones',
    'blog.tab.external': 'Publicaciones Externas',
    'blog.search': 'Buscar publicaciones...',
    'blog.noResults':
      'No se encontraron publicaciones que coincidan con tu búsqueda.',
    'contact.title': 'Contáctame',
    'contact.description': 'Hablemos sobre tu próximo proyecto u oportunidad de colaboración. Siempre estoy abierto a nuevos desafíos.',
    'contact.form.title': 'Ponte en Contacto',
    'contact.form.description':
      'Completa el formulario y te responderé lo antes posible.',
    'contact.form.name': 'Nombre',
    'contact.form.email': 'Correo Electrónico',
    'contact.form.message': 'Mensaje',
    'contact.form.send': 'Enviar Mensaje',
    'contact.form.sending': 'Enviando...',
    'contact.form.success.title': '¡Mensaje Enviado!',
    'contact.form.success.description':
      'Gracias por contactarme. Te responderé lo antes posible.',
    'contact.form.success.button': 'Enviar Otro Mensaje',
    'contact.info.email': 'Correo Electrónico',
    'contact.info.location': 'Ubicación',
    'contact.info.location.value': 'Remoto - Disponible Mundialmente',
    'contact.info.social': 'Perfiles Sociales',
    'footer.quickLinks': 'Enlaces Rápidos',
    'footer.connect': 'Conectar',
    'footer.copyright':
      'Construido con ❤️ usando TypeScript, Tailwind, Next.js',
    'footer.rights': 'Todos los derechos reservados.',
    'language.en': 'English',
    'language.es': 'Español',
    'language.fr': 'Français',
    'language.zh': '中文',
    'language.ar': 'العربية',
    'language.bn': 'বাংলা',
  },
  fr: {
    'nav.home': 'Accueil',
    'nav.about': 'À Propos',
    'nav.projects': 'Projets',
    'nav.skills': 'Compétences',
    'nav.resume': 'CV',
    'nav.blog': 'Blog',
    'nav.contact': 'Contact',
    'nav.admin': 'Admin',
    'hero.viewProjects': 'Voir les Projets',
    'hero.downloadResume': 'Télécharger CV',
    'hero.scrollDown': 'Défiler vers le Bas',
    'about.title': 'À Propos de Moi',
    'about.tab.bio': 'Biographie',
    'about.tab.journey': 'Parcours Professionnel',
    'about.tab.values': 'Valeurs Fondamentales',
    'about.value.passion': 'Passion',
    'about.value.excellence': 'Excellence',
    'about.value.innovation': 'Innovation',
    'about.mission.title': 'Ma Mission',
    'projects.title': 'Projets en Vedette',
    'projects.description':
      'Une sélection de mes travaux récents en architecture logicielle et développement backend.',
    'projects.viewAll': 'Voir Tous les Projets',
    'projects.liveDemo': 'Démo en Direct',
    'projects.viewCaseStudy': "Voir l'Étude de Cas",
    'projects.caseStudy.overview': 'Aperçu',
    'projects.caseStudy.process': 'Processus',
    'projects.caseStudy.tech': 'Technologies',
    'projects.caseStudy.gallery': 'Galerie',
    'projects.caseStudy.challenge': 'Défi',
    'projects.caseStudy.solution': 'Solution',
    'projects.caseStudy.results': 'Résultats',
    'projects.caseStudy.viewCode': 'Voir le Code',
        'skills.title': 'Compétences',
    'skills.description': 'Mon expertise technique et ma maîtrise de diverses technologies, frameworks et outils.',
    'skills.category.core': 'Principales',
    'skills.category.devops': 'DevOps',
    'skills.category.databases': 'Bases de Données',
    'skills.category.learning': 'Apprentissage',
    'testimonials.title': 'Ce Que Disent Les Gens',
    'testimonials.description':
      'Retours de clients et collègues sur mon travail et ma collaboration.',
    'timeline.title': 'Expérience et Formation',
    'timeline.description':
      'Mon parcours professionnel et ma formation académique.',
    'blog.title': 'Derniers Articles',
    'blog.description':
      "Réflexions et perspectives sur l'architecture logicielle, le développement backend et les tendances technologiques.",
    'blog.viewAll': 'Voir Tous les Articles',
    'blog.readMore': 'Lire Plus',
    'blog.tab.internal': 'Mes Articles',
    'blog.tab.external': 'Articles Externes',
    'blog.search': 'Rechercher des articles...',
    'blog.noResults': 'Aucun article correspondant à votre recherche.',
    'contact.title': 'Me Contacter',
    'contact.description': 'Discutons de votre prochain projet ou opportunité de collaboration. Je suis toujours ouvert à de nouveaux défis.',
    'contact.form.title': 'Entrer en Contact',
    'contact.form.description':
      'Remplissez le formulaire et je vous répondrai dès que possible.',
    'contact.form.name': 'Nom',
    'contact.form.email': 'Email',
    'contact.form.message': 'Message',
    'contact.form.send': 'Envoyer le Message',
    'contact.form.sending': 'Envoi en cours...',
    'contact.form.success.title': 'Message Envoyé !',
    'contact.form.success.description':
      "Merci de m'avoir contacté. Je vous répondrai dès que possible.",
    'contact.form.success.button': 'Envoyer un Autre Message',
    'contact.info.email': 'Email',
    'contact.info.location': 'Localisation',
    'contact.info.location.value': 'À Distance - Disponible Mondialement',
    'contact.info.social': 'Profils Sociaux',
    'footer.quickLinks': 'Liens Rapides',
    'footer.connect': 'Connecter',
    'footer.copyright':
      'Construit avec ❤️ en utilisant TypeScript, Tailwind, Next.js',
    'footer.rights': 'Tous droits réservés.',
    'language.en': 'English',
    'language.es': 'Español',
    'language.fr': 'Français',
    'language.zh': '中文',
    'language.ar': 'العربية',
    'language.bn': 'বাংলা',
  },
  zh: {
    'nav.home': '首页',
    'nav.about': '关于我',
    'nav.projects': '项目',
    'nav.skills': '技能',
    'nav.resume': '简历',
    'nav.blog': '博客',
    'nav.contact': '联系',
    'nav.admin': '管理',
    'hero.viewProjects': '查看项目',
    'hero.downloadResume': '下载简历',
    'hero.scrollDown': '向下滚动',
    'about.title': '关于我',
    'about.tab.bio': '个人简介',
    'about.tab.journey': '职业历程',
    'about.tab.values': '核心价值观',
    'about.value.passion': '热情',
    'about.value.excellence': '卓越',
    'about.value.innovation': '创新',
    'about.mission.title': '我的使命',
    'projects.title': '精选项目',
    'projects.description': '我在软件架构和后端开发方面的最新工作选集。',
    'projects.viewAll': '查看所有项目',
    'projects.liveDemo': '在线演示',
    'projects.viewCaseStudy': '查看案例研究',
    'projects.caseStudy.overview': '概述',
    'projects.caseStudy.process': '过程',
    'projects.caseStudy.tech': '技术栈',
    'projects.caseStudy.gallery': '图库',
    'projects.caseStudy.challenge': '挑战',
    'projects.caseStudy.solution': '解决方案',
    'projects.caseStudy.results': '结果',
    'projects.caseStudy.viewCode': '查看代码',
    'skills.title': '技能',
    'skills.description': '我在各种技术、框架和工具方面的技术专长和熟练程度。',
    'skills.category.core': '核心',
    'skills.category.devops': 'DevOps',
    'skills.category.databases': '数据库',
    'skills.category.learning': '学习中',
    'testimonials.title': '他人评价',
    'testimonials.description': '客户和同事对我的工作和协作的反馈。',
    'timeline.title': '经验与教育',
    'timeline.description': '我的职业历程和教育背景。',
    'blog.title': '最新博客文章',
    'blog.description': '关于软件架构、后端开发和技术趋势的思考和见解。',
    'blog.viewAll': '查看所有文章',
    'blog.readMore': '阅读更多',
    'blog.tab.internal': '我的文章',
    'blog.tab.external': '外部文章',
    'blog.search': '搜索博客文章...',
    'blog.noResults': '未找到符合您搜索条件的文章。',
    'contact.title': '联系我',
    'contact.description': '让我们讨论您的下一个项目或合作机会。我总是乐于接受新的挑战。',
    'contact.form.title': '取得联系',
    'contact.form.description': '填写表格，我会尽快回复您。',
    'contact.form.name': '姓名',
    'contact.form.email': '电子邮件',
    'contact.form.message': '留言',
    'contact.form.send': '发送留言',
    'contact.form.sending': '发送中...',
    'contact.form.success.title': '留言已发送！',
    'contact.form.success.description': '感谢您的留言。我会尽快回复您。',
    'contact.form.success.button': '发送另一条留言',
    'contact.info.email': '电子邮件',
    'contact.info.location': '位置',
    'contact.info.location.value': '远程 - 全球可用',
    'contact.info.social': '社交档案',
    'footer.quickLinks': '快速链接',
    'footer.connect': '连接',
    'footer.copyright': '使用TypeScript、Tailwind、Next.js构建，充满❤️',
    'footer.rights': '版权所有。',
    'language.en': 'English',
    'language.es': 'Español',
    'language.fr': 'Français',
    'language.zh': '中文',
    'language.ar': 'العربية',
    'language.bn': 'বাংলা',
  },
  ar: {
    'nav.home': 'الرئيسية',
    'nav.about': 'عني',
    'nav.projects': 'المشاريع',
    'nav.skills': 'المهارات',
    'nav.resume': 'السيرة الذاتية',
    'nav.blog': 'المدونة',
    'nav.contact': 'اتصل بي',
    'nav.admin': 'الإدارة',
    'hero.viewProjects': 'عرض المشاريع',
    'hero.downloadResume': 'تحميل السيرة الذاتية',
    'hero.scrollDown': 'مرر لأسفل',
    'about.title': 'عني',
    'about.tab.bio': 'السيرة الذاتية',
    'about.tab.journey': 'المسار المهني',
    'about.tab.values': 'القيم الأساسية',
    'about.value.passion': 'الشغف',
    'about.value.excellence': 'التميز',
    'about.value.innovation': 'الابتكار',
    'about.mission.title': 'مهمتي',
    'projects.title': 'مشاريع مميزة',
    'projects.description':
      'مجموعة مختارة من أعمالي الحديثة في هندسة البرمجيات وتطوير الواجهة الخلفية.',
    'projects.viewAll': 'عرض جميع المشاريع',
    'projects.liveDemo': 'عرض حي',
    'projects.viewCaseStudy': 'عرض دراسة الحالة',
    'projects.caseStudy.overview': 'نظرة عامة',
    'projects.caseStudy.process': 'العملية',
    'projects.caseStudy.tech': 'التقنيات المستخدمة',
    'projects.caseStudy.gallery': 'معرض الصور',
    'projects.caseStudy.challenge': 'التحدي',
    'projects.caseStudy.solution': 'الحل',
    'projects.caseStudy.results': 'النتائج',
    'projects.caseStudy.viewCode': 'عرض الكود',
    'skills.title': 'المهارات',
    'skills.description': 'خبرتي التقنية وإتقاني عبر مختلف التقنيات والأطر والأدوات.',
    'skills.category.core': 'أساسية',
    'skills.category.devops': 'DevOps',
    'skills.category.databases': 'قواعد البيانات',
    'skills.category.learning': 'قيد التعلم',
    'testimonials.title': 'ما يقوله الناس',
    'testimonials.description': 'آراء العملاء والزملاء حول عملي وتعاوني.',
    'timeline.title': 'الخبرة والتعليم',
    'timeline.description': 'مسيرتي المهنية وخلفيتي التعليمية.',
    'blog.title': 'أحدث المقالات',
    'blog.description':
      'أفكار ورؤى حول هندسة البرمجيات وتطوير الواجهة الخلفية واتجاهات التكنولوجيا.',
    'blog.viewAll': 'عرض جميع المقالات',
    'blog.readMore': 'قراءة المزيد',
    'blog.tab.internal': 'مقالاتي',
    'blog.tab.external': 'مقالات خارجية',
    'blog.search': 'البحث في المقالات...',
    'blog.noResults': 'لم يتم العثور على مقالات تطابق بحثك.',
    'contact.title': 'اتصل بي',
    'contact.description': 'لنناقش مشروعك القادم أو فرصة التعاون. أنا دائمًا منفتح على التحديات الجديدة.',
    'contact.form.title': 'تواصل معي',
    'contact.form.description': 'املأ النموذج وسأرد عليك في أقرب وقت ممكن.',
    'contact.form.name': 'الاسم',
    'contact.form.email': 'البريد الإلكتروني',
    'contact.form.message': 'الرسالة',
    'contact.form.send': 'إرسال الرسالة',
    'contact.form.sending': 'جاري الإرسال...',
    'contact.form.success.title': 'تم إرسال الرسالة!',
    'contact.form.success.description':
      'شكرًا للتواصل. سأرد عليك في أقرب وقت ممكن.',
    'contact.form.success.button': 'إرسال رسالة أخرى',
    'contact.info.email': 'البريد الإلكتروني',
    'contact.info.location': 'الموقع',
    'contact.info.location.value': 'عن بعد - متاح عالميًا',
    'contact.info.social': 'الملفات الاجتماعية',
    'footer.quickLinks': 'روابط سريعة',
    'footer.connect': 'تواصل',
    'footer.copyright': 'بُني بـ ❤️ باستخدام TypeScript وTailwind وNext.js',
    'footer.rights': 'جميع الحقوق محفوظة.',
    'language.en': 'English',
    'language.es': 'Español',
    'language.fr': 'Français',
    'language.zh': '中文',
    'language.ar': 'العربية',
    'language.bn': 'বাংলা',
  },
  bn: {
    'nav.home': 'হোম',
    'nav.about': 'আমার সম্পর্কে',
    'nav.projects': 'প্রকল্পসমূহ',
    'nav.skills': 'দক্ষতা',
    'nav.resume': 'রেজুমে',
    'nav.blog': 'ব্লগ',
    'nav.contact': 'যোগাযোগ',
    'nav.admin': 'অ্যাডমিন',
    'hero.viewProjects': 'প্রকল্পসমূহ দেখুন',
    'hero.downloadResume': 'রেজুমে ডাউনলোড করুন',
    'hero.scrollDown': 'নিচে স্ক্রোল করুন',
    'about.title': 'আমার সম্পর্কে',
    'about.tab.bio': 'জীবনী',
    'about.tab.journey': 'পেশাদার যাত্রা',
    'about.tab.values': 'মূল মূল্যবোধ',
    'about.value.passion': 'আবেগ',
    'about.value.excellence': 'শ্রেষ্ঠত্ব',
    'about.value.innovation': 'উদ্ভাবন',
    'about.mission.title': 'আমার মিশন',
    'projects.title': 'বৈশিষ্ট্যযুক্ত প্রকল্পসমূহ',
    'projects.description':
      'সফটওয়্যার আর্কিটেকচার এবং ব্যাকএন্ড ডেভেলপমেন্টে আমার সাম্প্রতিক কাজের একটি নির্বাচন।',
    'projects.viewAll': 'সমস্ত প্রকল্প দেখুন',
    'projects.liveDemo': 'লাইভ ডেমো',
    'projects.viewCaseStudy': 'কেস স্টাডি দেখুন',
    'projects.caseStudy.overview': 'ওভারভিউ',
    'projects.caseStudy.process': 'প্রক্রিয়া',
    'projects.caseStudy.tech': 'টেক স্ট্যাক',
    'projects.caseStudy.gallery': 'গ্যালারি',
    'projects.caseStudy.challenge': 'চ্যালেঞ্জ',
    'projects.caseStudy.solution': 'সমাধান',
    'projects.caseStudy.results': 'ফলাফল',
    'projects.caseStudy.viewCode': 'কোড দেখুন',
    'skills.title': 'দক্ষতা',
    'skills.category.core': 'মূল',
    'skills.category.devops': 'DevOps',
    'skills.category.databases': 'ডাটাবেস',
    'skills.category.learning': 'শিক্ষা',
    'testimonials.title': 'লোকেরা যা বলে',
    'testimonials.description':
      'আমার কাজ এবং সহযোগিতা সম্পর্কে ক্লায়েন্ট এবং সহকর্মীদের মতামত।',
    'timeline.title': 'অভিজ্ঞতা এবং শিক্ষা',
    'timeline.description': 'আমার পেশাদার যাত্রা এবং শিক্ষাগত পটভূমি।',
    'blog.title': 'সাম্প্রতিক ব্লগ পোস্ট',
    'blog.description':
      'সফটওয়্যার আর্কিটেকচার, ব্যাকএন্ড ডেভেলপমেন্ট এবং প্রযুক্তি প্রবণতা সম্পর্কে চিন্তাভাবনা এবং অন্তর্দৃষ্টি।',
    'blog.viewAll': 'সমস্ত পোস্ট দেখুন',
    'blog.readMore': 'আরও পড়ুন',
    'blog.tab.internal': 'আমার পোস্ট',
    'blog.tab.external': 'বাহ্যিক পোস্ট',
    'blog.search': 'ব্লগ পোস্ট অনুসন্ধান করুন...',
    'blog.noResults':
      'আপনার অনুসন্ধানের সাথে মিলে এমন কোন পোস্ট পাওয়া যায়নি।',
    'contact.title': 'যোগাযোগ করুন',
    'contact.description': 'আপনার পরবর্তী প্রকল্প বা সহযোগিতার সুযোগ নিয়ে আলোচনা করি। আমি সর্বদা নতুন চ্যালেঞ্জের জন্য উন্মুখ।',
    'contact.form.title': 'যোগাযোগ করুন',
    'contact.form.description':
      'ফর্মটি পূরণ করুন এবং আমি যত তাড়াতাড়ি সম্ভব আপনার সাথে যোগাযোগ করব।',
    'contact.form.name': 'নাম',
    'contact.form.email': 'ইমেইল',
    'contact.form.message': 'বার্তা',
    'contact.form.send': 'বার্তা পাঠান',
    'contact.form.sending': 'পাঠানো হচ্ছে...',
    'contact.form.success.title': 'বার্তা পাঠানো হয়েছে!',
    'contact.form.success.description':
      'যোগাযোগ করার জন্য ধন্যবাদ। আমি যত তাড়াতাড়ি সম্ভব আপনার সাথে যোগাযোগ করব।',
    'contact.form.success.button': 'আরেকটি বার্তা পাঠান',
    'contact.info.email': 'ইমেইল',
    'contact.info.location': 'অবস্থান',
    'contact.info.location.value': 'রিমোট - বিশ্বব্যাপী উপলব্ধ',
    'contact.info.social': 'সামাজিক প্রোফাইল',
    'footer.quickLinks': 'দ্রুত লিঙ্ক',
    'footer.connect': 'সংযোগ',
    'footer.copyright':
      'টাইপস্ক্রিপ্ট, টেইলউইন্ড, Next.js ব্যবহার করে ❤️ দিয়ে নির্মিত',
    'footer.rights': 'সর্বস্বত্ব সংরক্ষিত।',
    'language.en': 'English',
    'language.es': 'Español',
    'language.fr': 'Français',
    'language.zh': '中文',
    'language.ar': 'العربية',
    'language.bn': 'বাংলা',
  },
};

// Provider component
export function TranslationsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Get initial language from localStorage or browser settings
  const [language, setLanguageState] = useState<Language>('en');
  const [mounted, setMounted] = useState(false);

  // Set the language and store it in localStorage
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('preferred-language', lang);
      // Set the HTML lang attribute
      document.documentElement.lang = lang;
      // Set the dir attribute for RTL languages
      document.documentElement.dir = rtlLanguages.includes(lang)
        ? 'rtl'
        : 'ltr';
    }
  };

  // Initialize language from localStorage or browser settings
  useEffect(() => {
    const savedLanguage = localStorage.getItem(
      'preferred-language'
    ) as Language | null;

    if (savedLanguage) {
      setLanguage(savedLanguage);
    } else {
      // Try to use browser language
      const browserLanguage = navigator.language.split('-')[0] as Language;
      if (['en', 'es', 'fr', 'zh', 'ar', 'bn'].includes(browserLanguage)) {
        setLanguage(browserLanguage);
      }
    }

    setMounted(true);
  }, []);

  // Translation function - always return translation, never the key
  const t = (key: string): string => {
    return translations[language]?.[key] || translations['en']?.[key] || key;
  };

  // Date formatter based on current language
  const formatDate = (date: string | Date): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat(language, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(dateObj);
  };

  // Determine text direction based on language
  const dir = rtlLanguages.includes(language) ? 'rtl' : 'ltr';

  return (
    <TranslationsContext.Provider
      value={{ language, setLanguage, t, formatDate, dir }}
    >
      {children}
    </TranslationsContext.Provider>
  );
}

// Hook to use translations
export function useTranslations() {
  const context = useContext(TranslationsContext);
  if (context === undefined) {
    throw new Error(
      'useTranslations must be used within a TranslationsProvider'
    );
  }
  return context;
}
