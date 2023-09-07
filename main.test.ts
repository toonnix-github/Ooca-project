import Calculator from './main';

describe('Calculator', () => {
    let calculator: Calculator;

    beforeEach(() => {
        calculator = new Calculator();
    });

    it('calculates an order with Red and Green sets (no discount)', () => {
        const order = {
            Red: 1,
            Green: 1,
        };
        const hasMemberCard = false;
        const totalPrice = calculator.calculatePrice(order, hasMemberCard);

        // Expected total price: (1 * 50) + (1 * 40) = 90 THB
        expect(totalPrice).toBe(90);
    });

    it('calculates an order with a member card (10% for all)', () => {
        const order = {
            Red: 2,
            Green: 1,
        };
        const hasMemberCard = true;
        const totalPrice = calculator.calculatePrice(order, hasMemberCard);

        // Expected total price: ((2 * 50) + (1 * 40)) * 0.9 = 126 THB
        expect(totalPrice).toBe(126);
    });

    it('calculates an order with more than 2 Orange sets (5%)', () => {
        const order = {
            Orange: 3,
        };
        const hasMemberCard = false;
        const totalPrice = calculator.calculatePrice(order, hasMemberCard);

        // Expected total price: (3 * 120) * 0.95 = 342 THB
        expect(totalPrice).toBe(342);
    });

    it('calculates an order with more than 2 of Orange, Pink, and Green sets (5% for each)', () => {
        const order = {
            Orange: 2,
            Pink: 3,
            Green: 4,
        };
        const hasMemberCard = false;
        const totalPrice = calculator.calculatePrice(order, hasMemberCard);

        // Expected total price: ((2 * 120) + (3 * 80) + (4 * 40)) * 0.95 = 608 THB
        expect(totalPrice).toBe(608);
    });

    it('calculates an order with doubles discounts set and a member card (5% for each and 10% for all)', () => {
        const order = {
            Orange: 2,
            Pink: 3,
            Green: 4,
        };
        const hasMemberCard = true;
        const totalPrice = calculator.calculatePrice(order, hasMemberCard);

        // Expected total price: ((2 * 120 * 0.95) + (3 * 80 * 0.95) + (4 * 40 * 0.95)) * 0.90 = 608 THB
        expect(totalPrice).toBeCloseTo(547.2, 2);
    });

    it('calculates an order with a mix of products with a member card (5% for some and 10% for all)', () => {
        const order = {
            Red: 1,
            Green: 2, // Double discount product
            Yellow: 3,
            Pink: 2, // Double discount product
        };
        const hasMemberCard = true;
        const totalPrice = calculator.calculatePrice(order, hasMemberCard);

        // Expected total price:
        // Red   = 1 * 50 = 50
        // Green = 2 * 40 * 0.95 = 76
        // Yellow  = 3 * 50 = 150
        // Pink  = 2 * 80 * 0.95 = 152
        // Total = (50 + 76 + 150 + 152) * 0.90 = 376.2 THB
        expect(totalPrice).toBeCloseTo(385.2, 2);
    });

    it('calculates an order with a mix of products without a member card (5% for some)', () => {
        const order = {
            Red: 2,
            Green: 1, // Double discount product BUT not meet the criteria
            Blue: 3,
            Pink: 3, // Double discount product
        };
        const hasMemberCard = false;
        const totalPrice = calculator.calculatePrice(order, hasMemberCard);

        // Expected total price: 
        // Red   = 2 * 50 = 100
        // Green = 1 * 40 = 40 
        // Blue  = 3 * 30 = 90
        // Pink  = 3 * 80 * 0.95 = 228
        // Total = 100 + 40 + 90 + 228 = 355.25 THB
        expect(totalPrice).toBe(458);
    });

    it('calculates an order with zero quantity items', () => {
        const order = {
            Red: 2,
            Green: 0,
            Yellow: 0,
        };
        const hasMemberCard = false;
        const totalPrice = calculator.calculatePrice(order, hasMemberCard);
    
        // Expected total price: (2 * 50) = 100 THB
        expect(totalPrice).toBe(100);
    });

    it('calculates an order with negative quantity items', () => {
        const order = {
            Red: 1,
            Green: -2,
            Yellow: 3,
        };
        const hasMemberCard = false;
        const totalPrice = calculator.calculatePrice(order, hasMemberCard);
    
        // Expected total price: (1 * 50) + (invalid = 0) + (3 * 50) = 200 THB
        expect(totalPrice).toBe(200);
    });

    it('calculates an order with a large quantity of items', () => {
        const order: Record<string, number> = {
            Red: 100,
            Purple: 50,
            Yellow: 75,
        };
        const hasMemberCard = false;
        const totalPrice = calculator.calculatePrice(order, hasMemberCard);
    
        // Expected total price: (100 * 50) + (50 * 90) + (75 * 50) = 7500 THB
        expect(totalPrice).toBe(13250);
    });

    it('calculates an order with case-insensitive item names', () => {
        const order = {
            red: 2,
            BLUE: 3,
            YeLLoW: 1,
        };
        const hasMemberCard = false;
        const totalPrice = calculator.calculatePrice(order, hasMemberCard);
    
        // Expected total price: 0 THB
        expect(totalPrice).toBe(0);
    });

    it('handles items not on the menu', () => {
        const order = {
            Red: 1,
            NonExistentItem: 2,
        };
        const hasMemberCard = false;
        const totalPrice = calculator.calculatePrice(order, hasMemberCard);

        // NonExistentItem should be ignored, so the total price is just for Red: 1 * 50 = 50 THB
        expect(totalPrice).toBe(50);
    });

    it('handles blank order', () => {
        const order = {};
        const hasMemberCard = false;
        const totalPrice = calculator.calculatePrice(order, hasMemberCard);

        // Blank order should be ignored, so the total price is 0
        expect(totalPrice).toBe(0);
    });
});