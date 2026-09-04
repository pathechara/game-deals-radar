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

const priceFormatter = new Intl.NumberFormat("pl-PL", {
  style: "currency",
  currency: "PLN",
  currencyDisplay: "code",
});

function calculateDiscount(oldPrice, newPrice) {
  const discount = ((oldPrice - newPrice) / oldPrice) * 100;

  return Math.round(discount);
}

function formatPrice(amount) {
  return priceFormatter.format(amount);
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

function createDealCard(game) {
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
  oldPriceValue.textContent = formatPrice(game.oldPrice);
  newPriceLabel.textContent = "Новая цена";
  newPriceValue.textContent = formatPrice(game.newPrice);
  discountLabel.textContent = "Скидка";
  discountValue.textContent = `−${discount}%`;

  cardHeader.append(meta, title);
  oldPriceRow.append(oldPriceLabel, oldPriceValue);
  newPriceRow.append(newPriceLabel, newPriceValue);
  discountRow.append(discountLabel, discountValue);
  card.append(cardHeader, oldPriceRow, newPriceRow, discountRow);

  return card;
}

function renderGames(gameList) {
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
    fragment.append(createDealCard(game));
  });

  dealsGrid.append(fragment);
}

const searchInput = document.querySelector("#game-search");
const filtersForm = document.querySelector(".filters__form");

function updateSearchResults() {
  if (!searchInput) {
    return;
  }

  const filteredGames = filterGamesByTitle(games, searchInput.value);

  renderGames(filteredGames);
}

if (searchInput) {
  searchInput.addEventListener("input", updateSearchResults);
}

if (filtersForm) {
  filtersForm.addEventListener("submit", (event) => {
    event.preventDefault();
    updateSearchResults();
  });
}

renderGames(games);
