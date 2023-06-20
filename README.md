# MovieReviewsAnalyzer

Tematem projektu jest aplikacja do anlizy recenzji filmów wykorzystująca sztuczną inteligencję.  
W pierwszej części projekt skupia się na analizie sentymentów recenzji filmów, to znaczy analize wydźwięku tekstu, aby daną recenzję skategoryzować jako pozytywną bądź negatywną.
Zostaną w tym celu wykorzystane takie modele uczenia maszynowego jak:
- regresja logistyczna
- naiwny klasyfikator Bayesa

oraz modele uczenia głebokiego:
- rekurencyjna sieć neuronowa LSTM
- pretrenowany transformer BERT

# DEMO
Aplikacja dla zadanej recenzji filmowej zwraca wynikowy sentyment z poszczególnych modeli wraz z prawdopodobieństwem:

![models_1](https://github.com/WojK/MovieReviewsAnalyzer/assets/106305960/e88cd63e-357d-4e28-9c1a-355fb2f72d53)


Bazując na wytrenowanych współczynnikach dla poszczególnych wejść w modelu regresji logistycznej możemy określić wagę słów dla predykcji zadanej recenzji co również jest przedstawione jako wynik analizy:
![coef](https://github.com/WojK/MovieReviewsAnalyzer/assets/106305960/5327d7ed-d0eb-4bdd-a86a-a8364790e20b)

Aplikacja posiada funkcjonalność przyjmujowania plików z rozszerzeniem .csv aby zwracać wynik sentymentów dla grupy recenzji:

![csv_1](https://github.com/WojK/MovieReviewsAnalyzer/assets/106305960/8260e2b0-5a07-479d-ac6a-4d6fa232d030)
