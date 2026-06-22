import { config, fields, collection, singleton } from '@keystatic/core';

/**
 * Keystatic CMS для сайта «ППУ Альянс».
 *
 * storage: пока `local` (редактирование на машине разработчика через /keystatic,
 * правки пишутся в папку content/ и попадают в git). Для онлайн-редактирования на
 * Vercel переключить на:
 *   storage: { kind: 'github', repo: 'OWNER/REPO' }
 * и настроить GitHub App + переменные окружения KEYSTATIC_GITHUB_*, KEYSTATIC_SECRET.
 */
export default config({
  storage: { kind: 'github', repo: 'aleksandrbelyaev/ppu-alians' },
  ui: {
    brand: { name: 'ППУ Альянс' },
  },
  collections: {
    services: collection({
      label: 'Услуги (главная)',
      path: 'content/services/*',
      slugField: 'title',
      format: { data: 'yaml' },
      schema: {
        title: fields.slug({ name: { label: 'Заголовок' } }),
        text: fields.text({ label: 'Описание', multiline: true }),
        image: fields.url({ label: 'URL изображения' }),
        imageAlt: fields.text({ label: 'Alt изображения' }),
        href: fields.text({ label: 'Ссылка', defaultValue: '#' }),
        variant: fields.select({
          label: 'Вариант карточки',
          options: [
            { label: 'Обычная', value: 'normal' },
            { label: 'Широкая', value: 'wide' },
            { label: 'Все варианты', value: 'all' },
          ],
          defaultValue: 'normal',
        }),
        order: fields.integer({ label: 'Порядок', defaultValue: 0 }),
      },
    }),

    advantages: collection({
      label: 'Преимущества (главная)',
      path: 'content/advantages/*',
      slugField: 'title',
      format: { data: 'yaml' },
      schema: {
        title: fields.slug({ name: { label: 'Заголовок' } }),
        text: fields.text({ label: 'Описание', multiline: true }),
        icon: fields.url({ label: 'URL иконки' }),
        iconAlt: fields.text({ label: 'Alt иконки' }),
        order: fields.integer({ label: 'Порядок', defaultValue: 0 }),
      },
    }),

    reviews: collection({
      label: 'Отзывы (главная)',
      path: 'content/reviews/*',
      slugField: 'author',
      format: { data: 'yaml' },
      schema: {
        author: fields.slug({ name: { label: 'Автор' } }),
        role: fields.text({ label: 'Объект / роль' }),
        text: fields.text({ label: 'Текст отзыва', multiline: true }),
        order: fields.integer({ label: 'Порядок', defaultValue: 0 }),
      },
    }),

    faq: collection({
      label: 'FAQ (все страницы)',
      path: 'content/faq/*',
      slugField: 'question',
      format: { data: 'yaml' },
      schema: {
        question: fields.slug({ name: { label: 'Вопрос' } }),
        answer: fields.text({ label: 'Ответ', multiline: true }),
        page: fields.select({
          label: 'Страница',
          options: [
            { label: 'Главная', value: 'home' },
            { label: 'Цены', value: 'price' },
            { label: 'Акции', value: 'promotions' },
            { label: 'Услуга', value: 'service' },
          ],
          defaultValue: 'home',
        }),
        order: fields.integer({ label: 'Порядок', defaultValue: 0 }),
      },
    }),

    promotions: collection({
      label: 'Акции (страница «Акции»)',
      path: 'content/promotions/*',
      slugField: 'title',
      format: { data: 'yaml' },
      schema: {
        title: fields.slug({ name: { label: 'Заголовок' } }),
        text: fields.text({ label: 'Описание', multiline: true }),
        tags: fields.array(fields.text({ label: 'Тег' }), {
          label: 'Теги',
          itemLabel: (p) => p.value,
        }),
        main: fields.checkbox({ label: 'Главная акция (с ценой)', defaultValue: false }),
        priceOld: fields.text({ label: 'Старая цена (для главной)' }),
        priceNew: fields.text({ label: 'Новая цена (для главной)' }),
        priceUnit: fields.text({ label: 'Единица цены', defaultValue: '/ м²' }),
        conditions: fields.array(fields.text({ label: 'Условие' }), {
          label: 'Условия',
          itemLabel: (p) => p.value,
        }),
        buttonLabel: fields.text({ label: 'Текст кнопки', defaultValue: 'Уточнить условия' }),
        buttonStyle: fields.select({
          label: 'Стиль кнопки',
          options: [
            { label: 'Акцент', value: 'accent' },
            { label: 'Тёмная', value: 'dark' },
          ],
          defaultValue: 'dark',
        }),
        deadline: fields.text({ label: 'Срок (для главной)' }),
        category: fields.select({
          label: 'Категория (фильтр)',
          options: [
            { label: 'ППУ', value: 'ppu' },
            { label: 'Бонус', value: 'bonus' },
            { label: 'Сезон', value: 'season' },
            { label: 'Комплекс', value: 'complex' },
          ],
          defaultValue: 'ppu',
        }),
        order: fields.integer({ label: 'Порядок', defaultValue: 0 }),
      },
    }),
  },

  singletons: {
    site: singleton({
      label: 'Сайт: контакты и общие данные',
      path: 'content/site',
      format: { data: 'yaml' },
      schema: {
        phone: fields.text({ label: 'Телефон', defaultValue: '+7 985 617-55-54' }),
        phoneHref: fields.text({ label: 'Телефон (href)', defaultValue: 'tel:+79856175554' }),
        email: fields.text({ label: 'Email', defaultValue: 'info@ppu-alians.ru' }),
        region: fields.text({ label: 'Регион', defaultValue: 'Москва и Московская область' }),
        address: fields.text({ label: 'Адрес', defaultValue: 'Краснопахорское поселение, квартал №178' }),
        workSince: fields.text({ label: 'Работаем с', defaultValue: 'Работаем с 2008 года' }),
        minOrder: fields.text({ label: 'Минимальный заказ', defaultValue: 'от 60 000 ₽' }),
      },
    }),

    homePage: singleton({
      label: 'Страница: Главная',
      path: 'content/pages/home',
      format: { data: 'yaml' },
      schema: {
        seoTitle: fields.text({ label: 'SEO title' }),
        seoDescription: fields.text({ label: 'SEO description', multiline: true }),
        heroKicker: fields.text({ label: 'Hero: кикер' }),
        heroTitle: fields.text({ label: 'Hero: заголовок', multiline: true }),
        heroLead: fields.text({ label: 'Hero: лид', multiline: true }),
      },
    }),

    pricePage: singleton({
      label: 'Страница: Цены',
      path: 'content/pages/price',
      format: { data: 'yaml' },
      schema: {
        seoTitle: fields.text({ label: 'SEO title' }),
        seoDescription: fields.text({ label: 'SEO description', multiline: true }),
        heroKicker: fields.text({ label: 'Hero: кикер' }),
        heroTitle: fields.text({ label: 'Hero: заголовок', multiline: true }),
        heroLead: fields.text({ label: 'Hero: лид', multiline: true }),
      },
    }),

    promotionsPage: singleton({
      label: 'Страница: Акции',
      path: 'content/pages/promotions',
      format: { data: 'yaml' },
      schema: {
        seoTitle: fields.text({ label: 'SEO title' }),
        seoDescription: fields.text({ label: 'SEO description', multiline: true }),
        heroKicker: fields.text({ label: 'Hero: кикер' }),
        heroTitle: fields.text({ label: 'Hero: заголовок', multiline: true }),
        heroLead: fields.text({ label: 'Hero: лид', multiline: true }),
      },
    }),

    servicePage: singleton({
      label: 'Страница: Услуга (утепление дома)',
      path: 'content/pages/service',
      format: { data: 'yaml' },
      schema: {
        seoTitle: fields.text({ label: 'SEO title' }),
        seoDescription: fields.text({ label: 'SEO description', multiline: true }),
        heroKicker: fields.text({ label: 'Hero: кикер' }),
        heroTitle: fields.text({ label: 'Hero: заголовок', multiline: true }),
        heroLead: fields.text({ label: 'Hero: лид', multiline: true }),
      },
    }),
  },
});
