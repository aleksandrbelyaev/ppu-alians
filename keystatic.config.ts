import { config, fields, collection, singleton } from '@keystatic/core';

/**
 * Поле изображения для страниц услуг: можно ЛИБО загрузить файл (он попадёт в
 * public/images/services и в репозиторий), ЛИБО указать внешний URL. В шаблоне
 * используется upload, если он есть, иначе url.
 */
const serviceImage = (label: string) =>
  fields.object(
    {
      upload: fields.image({
        label: `${label}: загрузить файл`,
        directory: 'public/images/services',
        publicPath: '/images/services/',
      }),
      url: fields.text({ label: `${label}: или внешний URL` }),
      alt: fields.text({ label: `${label}: alt-текст` }),
    },
    { label },
  );

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
  // Локальный режим: редактирование в /keystatic пишет в файлы content/, которые
  // коммитятся и пушатся в GitHub. Это и есть GitHub-воркфлоу, без GitHub App.
  // Для онлайн-редактирования прямо с задеплоенного сайта см. README (github-режим).
  storage: { kind: 'github', repo:'aleksandrbelyaev/ppu-alians'},
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
    servicePages: collection({
      label: 'Страницы услуг',
      path: 'content/service-pages/*',
      slugField: 'title',
      format: { data: 'yaml' },
      schema: {
        title: fields.slug({
          name: { label: 'Название услуги (и URL)' },
          slug: { label: 'URL-адрес (slug)' },
        }),
        navLabel: fields.text({ label: 'Короткое название (для меню)' }),
        seoTitle: fields.text({ label: 'SEO title' }),
        seoDescription: fields.text({ label: 'SEO description', multiline: true }),
        breadcrumbLabel: fields.text({ label: 'Хлебные крошки: текущая страница' }),

        hero: fields.object(
          {
            kicker: fields.text({ label: 'Кикер' }),
            title: fields.text({ label: 'Заголовок H1', multiline: true }),
            lead: fields.text({ label: 'Лид (можно HTML)', multiline: true }),
            image: serviceImage('Фото в hero'),
            benefits: fields.array(fields.text({ label: 'Преимущество' }), {
              label: 'Преимущества (буллеты)',
              itemLabel: (p) => p.value,
            }),
            buttons: fields.array(
              fields.object({
                label: fields.text({ label: 'Текст' }),
                href: fields.text({ label: 'Ссылка', defaultValue: '#quote' }),
                style: fields.select({
                  label: 'Стиль',
                  options: [
                    { label: 'Акцент', value: 'accent' },
                    { label: 'Тёмная', value: 'dark' },
                  ],
                  defaultValue: 'accent',
                }),
              }),
              { label: 'Кнопки', itemLabel: (p) => p.fields.label.value },
            ),
            priceCard: fields.object(
              {
                enabled: fields.checkbox({ label: 'Показывать карточку цены', defaultValue: true }),
                label: fields.text({ label: 'Подпись' }),
                discount: fields.text({ label: 'Бейдж скидки' }),
                oldPrice: fields.text({ label: 'Старая цена' }),
                price: fields.text({ label: 'Цена' }),
                unit: fields.text({ label: 'Единица', defaultValue: '/ м²' }),
                note: fields.text({ label: 'Примечание', multiline: true }),
              },
              { label: 'Карточка цены' },
            ),
          },
          { label: 'Hero' },
        ),

        problems: fields.object(
          {
            enabled: fields.checkbox({ label: 'Показывать секцию', defaultValue: true }),
            kicker: fields.text({ label: 'Кикер' }),
            heading: fields.text({ label: 'Заголовок' }),
            intro: fields.text({ label: 'Вводный текст', multiline: true }),
            asideTitle: fields.text({ label: 'Заголовок врезки' }),
            asideText: fields.text({ label: 'Текст врезки', multiline: true }),
            asideTags: fields.array(fields.text({ label: 'Тег' }), {
              label: 'Теги врезки',
              itemLabel: (p) => p.value,
            }),
            cards: fields.array(
              fields.object({
                num: fields.text({ label: 'Номер' }),
                title: fields.text({ label: 'Заголовок' }),
                text: fields.text({ label: 'Текст', multiline: true }),
              }),
              { label: 'Карточки', itemLabel: (p) => p.fields.title.value },
            ),
          },
          { label: 'Секция «Когда нужно»' },
        ),

        ctaBand: fields.object(
          {
            enabled: fields.checkbox({ label: 'Показывать', defaultValue: true }),
            heading: fields.text({ label: 'Заголовок' }),
            text: fields.text({ label: 'Текст', multiline: true }),
            phone: fields.text({ label: 'Телефон', defaultValue: '+7 985 617-55-54' }),
            phoneHref: fields.text({ label: 'Телефон href', defaultValue: 'tel:+79856175554' }),
            buttonLabel: fields.text({ label: 'Текст кнопки' }),
            buttonHref: fields.text({ label: 'Ссылка кнопки', defaultValue: '#quote' }),
          },
          { label: 'CTA-полоса' },
        ),

        zones: fields.object(
          {
            enabled: fields.checkbox({ label: 'Показывать', defaultValue: true }),
            kicker: fields.text({ label: 'Кикер' }),
            heading: fields.text({ label: 'Заголовок' }),
            intro: fields.text({ label: 'Вводный текст', multiline: true }),
            cards: fields.array(
              fields.object({
                title: fields.text({ label: 'Заголовок' }),
                text: fields.text({ label: 'Текст', multiline: true }),
                wide: fields.checkbox({ label: 'Широкая карточка', defaultValue: false }),
                image: serviceImage('Фото зоны'),
              }),
              { label: 'Зоны', itemLabel: (p) => p.fields.title.value },
            ),
          },
          { label: 'Секция «Зоны утепления»' },
        ),

        tiers: fields.object(
          {
            enabled: fields.checkbox({ label: 'Показывать', defaultValue: true }),
            kicker: fields.text({ label: 'Кикер' }),
            heading: fields.text({ label: 'Заголовок' }),
            intro: fields.text({ label: 'Вводный текст', multiline: true }),
            asideTitle: fields.text({ label: 'Заголовок врезки' }),
            asideText: fields.text({ label: 'Текст врезки', multiline: true }),
            noteTitle: fields.text({ label: 'Заголовок плашки' }),
            noteText: fields.text({ label: 'Текст плашки', multiline: true }),
            cards: fields.array(
              fields.object({
                pill: fields.text({ label: 'Бейдж (плотность/толщина)' }),
                title: fields.text({ label: 'Заголовок' }),
                text: fields.text({ label: 'Текст', multiline: true }),
              }),
              { label: 'Варианты', itemLabel: (p) => p.fields.title.value },
            ),
          },
          { label: 'Секция «Технология/подбор»' },
        ),

        reasons: fields.object(
          {
            enabled: fields.checkbox({ label: 'Показывать', defaultValue: true }),
            kicker: fields.text({ label: 'Кикер' }),
            heading: fields.text({ label: 'Заголовок' }),
            intro: fields.text({ label: 'Вводный текст', multiline: true }),
            cards: fields.array(
              fields.object({
                title: fields.text({ label: 'Заголовок' }),
                text: fields.text({ label: 'Текст', multiline: true }),
                items: fields.array(fields.text({ label: 'Пункт' }), {
                  label: 'Список',
                  itemLabel: (p) => p.value,
                }),
              }),
              { label: 'Карточки сравнения', itemLabel: (p) => p.fields.title.value },
            ),
          },
          { label: 'Секция «Почему ППУ»' },
        ),

        suitable: fields.object(
          {
            enabled: fields.checkbox({ label: 'Показывать', defaultValue: true }),
            kicker: fields.text({ label: 'Кикер' }),
            heading: fields.text({ label: 'Заголовок' }),
            intro: fields.text({ label: 'Вводный текст', multiline: true }),
            items: fields.array(
              fields.object({
                title: fields.text({ label: 'Заголовок' }),
                text: fields.text({ label: 'Текст', multiline: true }),
              }),
              { label: 'Типы', itemLabel: (p) => p.fields.title.value },
            ),
          },
          { label: 'Секция «Для каких домов»' },
        ),

        steps: fields.object(
          {
            enabled: fields.checkbox({ label: 'Показывать', defaultValue: true }),
            kicker: fields.text({ label: 'Кикер' }),
            heading: fields.text({ label: 'Заголовок' }),
            intro: fields.text({ label: 'Вводный текст', multiline: true }),
            items: fields.array(
              fields.object({
                title: fields.text({ label: 'Заголовок' }),
                text: fields.text({ label: 'Текст', multiline: true }),
                tag: fields.text({ label: 'Тег (срок/пометка)' }),
              }),
              { label: 'Шаги', itemLabel: (p) => p.fields.title.value },
            ),
          },
          { label: 'Секция «Порядок работ»' },
        ),

        form: fields.object(
          {
            enabled: fields.checkbox({ label: 'Показывать', defaultValue: true }),
            kicker: fields.text({ label: 'Кикер' }),
            heading: fields.text({ label: 'Заголовок' }),
            lead: fields.text({ label: 'Лид', multiline: true }),
            buttonLabel: fields.text({ label: 'Текст кнопки', defaultValue: 'Отправить на расчет' }),
            selectLabel: fields.text({ label: 'Подпись селекта', defaultValue: 'Что утепляем?' }),
            objectOptions: fields.array(fields.text({ label: 'Вариант' }), {
              label: 'Варианты селекта',
              itemLabel: (p) => p.value,
            }),
            stats: fields.array(
              fields.object({
                value: fields.text({ label: 'Значение' }),
                label: fields.text({ label: 'Подпись' }),
              }),
              { label: 'Мини-статистика', itemLabel: (p) => p.fields.value.value },
            ),
          },
          { label: 'Секция «Форма расчёта»' },
        ),

        cases: fields.object(
          {
            enabled: fields.checkbox({ label: 'Показывать', defaultValue: true }),
            kicker: fields.text({ label: 'Кикер' }),
            heading: fields.text({ label: 'Заголовок' }),
            intro: fields.text({ label: 'Вводный текст', multiline: true }),
            main: fields.object(
              {
                title: fields.text({ label: 'Заголовок' }),
                text: fields.text({ label: 'Текст', multiline: true }),
                meta: fields.array(fields.text({ label: 'Метка' }), {
                  label: 'Метки',
                  itemLabel: (p) => p.value,
                }),
                image: serviceImage('Фото главного кейса'),
              },
              { label: 'Главный кейс' },
            ),
            side: fields.array(
              fields.object({
                title: fields.text({ label: 'Заголовок' }),
                text: fields.text({ label: 'Текст', multiline: true }),
                meta: fields.array(fields.text({ label: 'Метка' }), {
                  label: 'Метки',
                  itemLabel: (p) => p.value,
                }),
                image: serviceImage('Фото кейса'),
              }),
              { label: 'Доп. кейсы', itemLabel: (p) => p.fields.title.value },
            ),
          },
          { label: 'Секция «Кейсы»' },
        ),

        gallery: fields.object(
          {
            enabled: fields.checkbox({ label: 'Показывать', defaultValue: true }),
            kicker: fields.text({ label: 'Кикер' }),
            heading: fields.text({ label: 'Заголовок' }),
            intro: fields.text({ label: 'Вводный текст', multiline: true }),
            photos: fields.array(
              fields.object({
                image: serviceImage('Фото'),
                title: fields.text({ label: 'Заголовок' }),
                caption: fields.text({ label: 'Подпись', multiline: true }),
                size: fields.select({
                  label: 'Размер плитки',
                  options: [
                    { label: 'Обычная', value: 'normal' },
                    { label: 'Широкая', value: 'wide' },
                    { label: 'Высокая', value: 'tall' },
                  ],
                  defaultValue: 'normal',
                }),
              }),
              { label: 'Фотографии', itemLabel: (p) => p.fields.title.value },
            ),
          },
          { label: 'Секция «Галерея работ»' },
        ),

        advantages: fields.object(
          {
            enabled: fields.checkbox({ label: 'Показывать', defaultValue: true }),
            kicker: fields.text({ label: 'Кикер' }),
            heading: fields.text({ label: 'Заголовок' }),
            intro: fields.text({ label: 'Вводный текст', multiline: true }),
            cards: fields.array(
              fields.object({
                title: fields.text({ label: 'Заголовок' }),
                text: fields.text({ label: 'Текст', multiline: true }),
              }),
              { label: 'Преимущества', itemLabel: (p) => p.fields.title.value },
            ),
          },
          { label: 'Секция «Почему мы»' },
        ),

        certificates: fields.object(
          {
            enabled: fields.checkbox({ label: 'Показывать', defaultValue: true }),
            kicker: fields.text({ label: 'Кикер' }),
            heading: fields.text({ label: 'Заголовок' }),
            intro: fields.text({ label: 'Вводный текст', multiline: true }),
            cards: fields.array(
              fields.object({
                title: fields.text({ label: 'Заголовок' }),
                text: fields.text({ label: 'Текст', multiline: true }),
                image: serviceImage('Превью'),
              }),
              { label: 'Документы', itemLabel: (p) => p.fields.title.value },
            ),
          },
          { label: 'Секция «Сертификаты»' },
        ),

        reviews: fields.object(
          {
            enabled: fields.checkbox({ label: 'Показывать', defaultValue: true }),
            kicker: fields.text({ label: 'Кикер' }),
            heading: fields.text({ label: 'Заголовок' }),
            intro: fields.text({ label: 'Вводный текст', multiline: true }),
            items: fields.array(
              fields.object({
                text: fields.text({ label: 'Отзыв', multiline: true }),
                author: fields.text({ label: 'Автор' }),
                role: fields.text({ label: 'Объект / роль' }),
              }),
              { label: 'Отзывы', itemLabel: (p) => p.fields.author.value },
            ),
          },
          { label: 'Секция «Отзывы»' },
        ),

        faq: fields.object(
          {
            enabled: fields.checkbox({ label: 'Показывать', defaultValue: true }),
            kicker: fields.text({ label: 'Кикер' }),
            heading: fields.text({ label: 'Заголовок' }),
            intro: fields.text({ label: 'Вводный текст', multiline: true }),
            buttonLabel: fields.text({ label: 'Текст кнопки', defaultValue: 'Задать вопрос' }),
            items: fields.array(
              fields.object({
                question: fields.text({ label: 'Вопрос' }),
                answer: fields.text({ label: 'Ответ', multiline: true }),
              }),
              { label: 'Вопросы', itemLabel: (p) => p.fields.question.value },
            ),
          },
          { label: 'Секция «FAQ»' },
        ),

        finalCta: fields.object(
          {
            enabled: fields.checkbox({ label: 'Показывать', defaultValue: true }),
            kicker: fields.text({ label: 'Кикер' }),
            heading: fields.text({ label: 'Заголовок' }),
            text: fields.text({ label: 'Текст', multiline: true }),
          },
          { label: 'Финальный CTA' },
        ),
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

  },
});
