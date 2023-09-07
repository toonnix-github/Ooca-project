type MenuItem = {
    name: string;
    price: number;
};

class Calculator {
    private readonly menu: Record<string, MenuItem> = {
        Red: { name: 'Red', price: 50 },
        Green: { name: 'Green', price: 40 },
        Blue: { name: 'Blue', price: 30 },
        Yellow: { name: 'Yellow', price: 50 },
        Pink: { name: 'Pink', price: 80 },
        Purple: { name: 'Purple', price: 90 },
        Orange: { name: 'Orange', price: 120 },
    };

    private readonly doubleDiscountItems: Set<string> = new Set(['Orange', 'Pink', 'Green']);
    private readonly doubleDiscountMultiplier: number = 0.95;

    public calculatePrice(order: Record<string, number>, hasMemberCard: boolean): number {
        let totalPrice: number = 0;

        for (const itemName in order) {
            const menuItem = this.menu[itemName];
            const itemCount = order[itemName];
            if (itemCount <= 0) {
                console.warn(`Invalid item amount: ${itemCount}`);
            }
            else if (order.hasOwnProperty(itemName) && this.menu.hasOwnProperty(itemName)) {
                if (this.isDoubleDiscountEligible(itemName, itemCount)) {
                    totalPrice += menuItem.price * itemCount * this.doubleDiscountMultiplier;
                } else {
                    totalPrice += menuItem.price * itemCount;
                }
            }
            else {
                console.warn(`Invalid item: ${itemName}`);
            }
        }

        if (hasMemberCard) {
            totalPrice *= 0.9; // Apply 10% member card discount
        }

        return totalPrice;
    }

    private isDoubleDiscountEligible(itemName: string, itemCount: number): boolean {
        return this.doubleDiscountItems.has(itemName) && itemCount >= 2;
    }
}

export default Calculator;


// Example
const calculator = new Calculator();
const order = {
    Red: 1,
    Green: 1,
};
const hasMemberCard = false;
const totalPrice = calculator.calculatePrice(order, hasMemberCard);
console.log(totalPrice);