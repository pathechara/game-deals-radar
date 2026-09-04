const games = [
  {
    id: "hades",
    title: "Hades",
    genre: "Экшен",
    store: "Steam",
    oldPrice: 110.99,
    newPrice: 55.49,
  },
  {
    id: "hollow-knight",
    title: "Hollow Knight",
    genre: "Приключение",
    store: "GOG",
    oldPrice: 64.99,
    newPrice: 32.49,
  },
  {
    id: "disco-elysium",
    title: "Disco Elysium",
    genre: "RPG",
    store: "Steam",
    oldPrice: 169.99,
    newPrice: 42.49,
  },
  {
    id: "cyberpunk-2077",
    title: "Cyberpunk 2077",
    genre: "RPG",
    store: "GOG",
    oldPrice: 199.99,
    newPrice: 99.99,
  },
  {
    id: "the-witcher-3",
    title: "The Witcher 3",
    genre: "RPG",
    store: "Steam",
    oldPrice: 129.99,
    newPrice: 38.99,
  },
  {
    id: "celeste",
    title: "Celeste",
    genre: "Платформер",
    store: "Epic Games Store",
    oldPrice: 84.99,
    newPrice: 21.24,
  },
];

const DEMO_CURRENCY_CONFIG = {
  PLN: { rateFromPln: 1, locale: "pl-PL", code: "PLN" },
  UAH: { rateFromPln: 10, locale: "uk-UA", code: "UAH" },
  EUR: { rateFromPln: 0.23, locale: "de-DE", code: "EUR" },
  USD: { rateFromPln: 0.25, locale: "en-US", code: "USD" },
};

const priceFormatters = new Map();

function calculateDiscount(oldPrice, newPrice) {
  const discount = ((oldPrice - newPrice) / oldPrice) * 100;

  return Math.round(discount);
}

function convertPrice(amountInPln, currency) {
  const config = DEMO_CURRENCY_CONFIG[currency] ?? DEMO_CURRENCY_CONFIG.PLN;

  return amountInPln * config.rateFromPln;
}

function formatPrice(amount, currency) {
  const config = DEMO_CURRENCY_CONFIG[currency] ?? DEMO_CURRENCY_CONFIG.PLN;

  if (!priceFormatters.has(config.code)) {
    const formatter = new Intl.NumberFormat(config.locale, {
      style: "currency",
      currency: config.code,
      currencyDisplay: "code",
    });

    priceFormatters.set(config.code, formatter);
  }

  return priceFormatters.get(config.code).format(amount);
}

function filterGamesByTitle(gameList, query) {
  const normalizedQuery = query.trim().toLocaleLowerCase("ru");

  if (!normalizedQuery) {
    return [...gameList];
  }

  return gameList.filter((game) =>
    game.title.toLocaleLowerCase("ru").includes(normalizedQuery),
  );
}

function sortGames(gameList, sortBy) {
  const sortedGames = [...gameList];
  const compareByTitle = (firstGame, secondGame) =>
    firstGame.title.localeCompare(secondGame.title, "ru", {
      sensitivity: "base",
    });

  switch (sortBy) {
    case "discount-desc":
      return sortedGames.sort(
        (firstGame, secondGame) =>
          calculateDiscount(secondGame.oldPrice, secondGame.newPrice) -
            calculateDiscount(firstGame.oldPrice, firstGame.newPrice) ||
          compareByTitle(firstGame, secondGame),
      );
    case "price-asc":
      return sortedGames.sort(
        (firstGame, secondGame) =>
          firstGame.newPrice - secondGame.newPrice ||
          compareByTitle(firstGame, secondGame),
      );
    case "price-desc":
      return sortedGames.sort(
        (firstGame, secondGame) =>
          secondGame.newPrice - firstGame.newPrice ||
          compareByTitle(firstGame, secondGame),
      );
    case "title-asc":
      return sortedGames.sort(compareByTitle);
    default:
      return sortedGames;
  }
}

function createDealCard(game, currency) {
  const card = document.createElement("article");
  const cardHeader = document.createElement("header");
  const meta = document.createElement("p");
  const title = document.createElement("h3");
  const oldPriceRow = document.createElement("p");
  const oldPriceLabel = document.createElement("span");
  const oldPriceValue = document.createElement("del");
  const newPriceRow = document.createElement("p");
  const newPriceLabel = document.createElement("span");
  const newPriceValue = document.createElement("strong");
  const discountRow = document.createElement("p");
  const discountLabel = document.createElement("span");
  const discountValue = document.createElement("strong");
  const discount = calculateDiscount(game.oldPrice, game.newPrice);
  const convertedOldPrice = convertPrice(game.oldPrice, currency);
  const convertedNewPrice = convertPrice(game.newPrice, currency);

  card.className = "deal-card";
  card.dataset.gameId = game.id;
  cardHeader.className = "deal-card__header";
  meta.className = "deal-card__meta";
  title.className = "deal-card__title";
  oldPriceRow.className = "deal-card__price deal-card__price--old";
  newPriceRow.className = "deal-card__price deal-card__price--new";
  discountRow.className = "deal-card__discount";

  meta.textContent = `${game.genre} · ${game.store}`;
  title.textContent = game.title;
  oldPriceLabel.textContent = "Старая цена";
  oldPriceValue.textContent = formatPrice(convertedOldPrice, currency);
  newPriceLabel.textContent = "Новая цена";
  newPriceValue.textContent = formatPrice(convertedNewPrice, currency);
  discountLabel.textContent = "Скидка";
  discountValue.textContent = `−${discount}%`;

  cardHeader.append(meta, title);
  oldPriceRow.append(oldPriceLabel, oldPriceValue);
  newPriceRow.append(newPriceLabel, newPriceValue);
  discountRow.append(discountLabel, discountValue);
  card.append(cardHeader, oldPriceRow, newPriceRow, discountRow);

  return card;
}

function renderGames(gameList, currency) {
  const dealsGrid = document.querySelector(".deals-grid");
  const resultsStatus = document.querySelector("#results-status");

  if (!dealsGrid) {
    return;
  }

  dealsGrid.replaceChildren();

  if (resultsStatus) {
    resultsStatus.textContent = `Найдено игр: ${gameList.length}`;
  }

  if (gameList.length === 0) {
    const emptyState = document.createElement("p");

    emptyState.className = "deals-grid__empty";
    emptyState.textContent = "Игры не найдены";
    dealsGrid.append(emptyState);

    return;
  }

  const fragment = document.createDocumentFragment();

  gameList.forEach((game) => {
    fragment.append(createDealCard(game, currency));
  });

  dealsGrid.append(fragment);
}

const searchInput = document.querySelector("#game-search");
const currencySelect = document.querySelector("#currency");
const sortSelect = document.querySelector("#sort-by");
const filtersForm = document.querySelector(".filters__form");

function updateView() {
  if (!searchInput || !sortSelect || !currencySelect) {
    return;
  }

  const query = searchInput.value;
  const filteredGames = filterGamesByTitle(games, query);
  const sortBy = sortSelect.value;
  const sortedGames = sortGames(filteredGames, sortBy);
  const selectedCurrency = currencySelect.value;

  renderGames(sortedGames, selectedCurrency);
}

if (searchInput) {
  searchInput.addEventListener("input", updateView);
}

if (currencySelect) {
  currencySelect.addEventListener("change", updateView);
}

if (sortSelect) {
  sortSelect.addEventListener("change", updateView);
}

if (filtersForm) {
  filtersForm.addEventListener("submit", (event) => {
    event.preventDefault();
    updateView();
  });
}

updateView();
