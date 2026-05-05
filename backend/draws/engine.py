import random
from collections import Counter

def run_random_draw():
    """Pick 5 unique numbers from 1-45"""
    return sorted(random.sample(range(1, 46), 5))

def run_algorithmic_draw(all_scores):
    """
    Weighted draw — numbers that appear most in user scores
    are more likely to be chosen
    """
    if not all_scores:
        return run_random_draw()

    counter = Counter(all_scores)
    population = list(counter.keys())
    weights = [counter[s] for s in population]

    drawn = []
    attempts = 0
    while len(drawn) < 5 and attempts < 1000:
        pick = random.choices(population, weights=weights, k=1)[0]
        if pick not in drawn:
            drawn.append(pick)
        attempts += 1

    # Fill remaining with random if needed
    while len(drawn) < 5:
        pick = random.randint(1, 45)
        if pick not in drawn:
            drawn.append(pick)

    return sorted(drawn)

def check_matches(user_scores, winning_numbers):
    """Returns how many of user scores match winning numbers"""
    return len(set(user_scores) & set(winning_numbers))

def calculate_prize_pools(subscriber_count, monthly_fee=9.99, rollover=0):
    """Calculate prize pool split from subscriptions"""
    total = round(subscriber_count * monthly_fee * 0.50, 2)
    return {
        'total': total,
        'five_match': round(total * 0.40 + float(rollover), 2),
        'four_match': round(total * 0.35, 2),
        'three_match': round(total * 0.25, 2),
    }