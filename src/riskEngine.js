/**
 * CORE RISK ENGINE
 * Responsible for pre-trade validation and platform safety.
 */
class RiskEngine {
    constructor(maxLeverage = 10, maxExposurePerUser = 0.20) {
        this.maxLeverage = maxLeverage;
        this.maxExposurePerUser = maxExposurePerUser; 
    }

    validateOrder(user, order) {
        const { balance, totalOpenPositionsValue } = user;
        const orderValue = (order.amount || 0) * (order.leverage || 1);

        if (order.leverage > this.maxLeverage) {
            return { allowed: false, reason: "LEVERAGE_EXCEEDED" };
        }

        if (order.amount > balance) {
            return { allowed: false, reason: "INSUFFICIENT_FUNDS" };
        }

        const potentialExposure = (totalOpenPositionsValue + orderValue) / (balance || 1);
        if (potentialExposure > 1.5) { 
            return { allowed: false, reason: "EXPOSURE_LIMIT_REACHED" };
        }

        return { allowed: true, marginRequired: order.amount };
    }
}

const instance = new RiskEngine();
export default instance;
