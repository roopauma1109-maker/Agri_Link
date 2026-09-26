def get_sale_window_recommendation(crop_name: str, current_price: float, avg_7day: float, trend_percent: float, arrival_volume: float):
    """
    Transparent rule-based market recommendation system for AgriLink.
    Future-ready for Machine Learning models.
    """
    demand = "High" if trend_percent > 3.0 else ("Moderate" if trend_percent >= 0.0 else "Low")
    arrival = "Moderate" if arrival_volume < 300 else "High"
    
    expected_min = round(current_price * 0.98, 1)
    expected_max = round(current_price * (1.10 if trend_percent > 0 else 1.02), 1)
    
    if trend_percent > 3.0 and arrival != "High":
        recommendation_text = f"Favorable selling window! Prices for {crop_name} show an upward trend (+{trend_percent}%). High market demand in Mumbai & Nashik. Farmers are advised to compare buyer offers before immediate spot sale."
        status_badge = "Favorable Selling Window"
        color = "green"
    elif trend_percent < -2.0:
        recommendation_text = f"Arrival volume is high and prices are under downward pressure ({trend_percent}%). Consider exploring nearby cold storage options or pooling with FPO aggregated lots."
        status_badge = "Consider Storage / FPO Aggregation"
        color = "amber"
    else:
        recommendation_text = f"Market prices for {crop_name} are steady around ₹{current_price}/kg. Demand is moderate across major Maharashtra mandis."
        status_badge = "Stable Market Window"
        color = "blue"

    return {
        "crop_name": crop_name,
        "current_price": current_price,
        "avg_7day": avg_7day,
        "trend_percent": trend_percent,
        "expected_range": f"₹{expected_min}–₹{expected_max}/kg",
        "demand_level": demand,
        "arrival_volume": f"{arrival_volume} tons",
        "recommendation": recommendation_text,
        "status_badge": status_badge,
        "badge_color": color,
        "note": "Rule-based intelligence derived from current mandi trends (Demo Model)."
    }
