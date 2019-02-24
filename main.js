document.addEventListener("DOMContentLoaded", function() {
  document.body.addEventListener("mouseover", function(ev) {
    if (ev.target == document.body) {
      document.body.style.backgroundColor = "#e9e6d3";
    }
  });

  document.body.addEventListener("mouseout", function(ev) {
    document.body.style.backgroundColor = "#f6f2de";
  });

  var source = document.querySelector("#cards").innerHTML,
      template = Handlebars.compile(source);

  for (var i = 0; i < cards.length; i++) {
    if (cards.length > 1 && cards[i] == cards[cards.length - 1]) {
      if (cards[cards.length - 1].type == "narrow") {
        renderCard(cards.length, "card_narrow", "card_top");
      } else {
        renderCard(cards.length, "card_wide_top", "card_top");
      }
    } else {
      if (cards[i].type == "narrow") {
        renderCard(i + 1, "card_narrow");
      } else if (cards.length == 1) {
        renderCard(i + 1, "card_wide_top");
      } else {
        renderCard(i + 1, "card_wide");
      }
    }
  }

  window.history.replaceState(cards, "", null);

  var flagShift = false,
      flagAlt = false;

  document.addEventListener("keydown", function(ev) {
    if (ev.which == 16) {
      flagShift = true;
    }
    if (ev.which == 18) {
      flagAlt = true;
    }
  });

  document.addEventListener("keyup", function(ev) {
    if (ev.which == 16) {
      flagShift = false;
    }
    if (ev.which == 18) {
      flagAlt = false;
    }
  });

  var allCards = getCards();

  for (var i = 0; i < allCards.length; i++) {
    addEvent(allCards[i], "click", pickCardAction);
  }

  window.addEventListener("popstate", function(ev) {
    var allCards = getCards();

    if (ev.state != null) {
      if (allCards.length > ev.state.length) {
        for (var i = ev.state.length; i < allCards.length; i++) {
          deleteCard();
        }
      } else if (allCards.length < ev.state.length && allCards.length != 0) {
        for (var i = allCards.length; i < ev.state.length; i++) {
          if (ev.state[i].type == "narrow") {
            addNarrowCard();
          } else {
            addWideCard();
          }
        }
      } else {
        if ((ev.state[0].type = "narrow")) {
          renderCard(ev.state.length, "card_narrow");
          allCards = getCards();
          addEvent(allCards[allCards.length - 1], "click", pickCardAction);
        } else {
          renderCard(ev.state.length, "card_wide_top");
          allCards = getCards();
          addEvent(allCards[allCards.length - 1], "click", pickCardAction);
        }
      }
    } else {
      allCards[0].parentNode.removeChild(allCards[0]);
    }
  });

  function renderCard(number, type, position) {
    var context = {
      cardNumber: number,
      cardType: type,
      cardPosition: position
    };

    var html = template(context);
    $("body").append(html);
  }

  function deleteCard() {
    var allCards = getCards();

    if (allCards.length == 1) {
      var lastCard = allCards[0];
      lastCard.parentNode.removeChild(lastCard);
    } else {
      var topCard = allCards[allCards.length - 1];
      topCard.parentNode.removeChild(topCard);

      if (allCards[allCards.length - 2].classList.contains("card_wide")) {
        allCards[allCards.length - 2].classList.remove("card_wide");
        allCards[allCards.length - 2].classList.add("card_wide_top");
      }

      if (allCards.length > 2) {
        allCards[allCards.length - 2].classList.add("card_top");
      }
    }
  }

  function addNarrowCard() {
    var allCards = getCards();

    renderCard(allCards.length + 1, "card_narrow", "card_top");
    allCards[allCards.length - 1].classList.remove("card_top");

    if (allCards[allCards.length - 1].classList.contains("card_wide_top")) {
      allCards[allCards.length - 1].classList.remove("card_wide_top");
      allCards[allCards.length - 1].classList.add("card_wide");
    }

    var newCard = document.querySelector(".card_top");
    addEvent(newCard, "click", pickCardAction);
  }

  function addWideCard() {
    var allCards = getCards();

    renderCard(allCards.length + 1, "card_wide_top", "card_top");
    allCards[allCards.length - 1].classList.remove("card_top");

    if (allCards[allCards.length - 1].classList.contains("card_wide_top")) {
      allCards[allCards.length - 1].classList.remove("card_wide_top");
      allCards[allCards.length - 1].classList.add("card_wide");
    }

    var newCard = document.querySelector(".card_top");
    addEvent(newCard, "click", pickCardAction);
  }

  function addHistoryState() {
    var allCards = getCards();
    if (allCards.length > 0) {
      var cardsData = [];

      for (var i = 0; i < allCards.length; i++) {
        var type = allCards[i].classList.contains("card_narrow")
          ? "narrow"
          : "wide";
        cardsData.push({ type: type });
      }

      window.history.pushState(cardsData, "", null);
      
    } else {
      window.history.pushState(null, "", null);
    }
  }

  function addEvent(elem, type, handler) {
    elem.addEventListener(type, handler);
  }

  function getCards() {
    return document.querySelectorAll(".card");
  }

  function pickCardAction() {
    if (flagShift && flagAlt) {
      addWideCard();
    } else if (flagShift && !flagAlt) {
      addNarrowCard();
    } else {
      deleteCard();
    }

    addHistoryState();
  }
});
