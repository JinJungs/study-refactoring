export default function createStatmentData(invoice, plays) {
    const result = {};
    result.customer = invoice.customer;   // 고객 데이터를 중간 데이터로 옮김
    result.performances = invoice.performances.map(enrichPerformance);   // 공연 정보를 중간 데이터로 옮김
    result.totalAmount = totalAmount(result);
    result.totalVolumeCredits = totalVolumeCredits(result);
    return result;
}

function enrichPerformance(aPerformance) {
    // const calculator = new PerformanceCalculator(aPerformance, playFor(aPerformance)); // 공연료 계산기 생성
    const calculator = createPerformanceCalculator(aPerformance, playFor(aPerformance));    // 생성자 대신 팩토리 함수 이용
    const result = Object.assign({}, aPerformance); // 얕은 복사 수행
    result.play = calculator.play;     
    result.amount = calculator.amount;
    result.volumeCredits = calculator.volumeCredits;
    return result;
}

function createPerformanceCalculator(aPerformance, aPlay) {
    // return new PerformanceCalculator(aPerformance, aPlay);
    switch(aPlay.type) {
    case "tragedy": return new TragedyCalculator(aPerformance, aPlay);
    case "comedy": return new ComedyCalculator(aPerformance, aPlay);
    default:
        throw new Error('알 수 없는 장르: ${aPlay.type}');
    }
}

class TragedyCalculator extends PerformanceCalculator {
    get amount() {
        let result = 40000;
        if(this.performance.audience > 30){
            result += 1000 * (this.performance.audience - 30);
        }
        return result;
    }
}
class ComedyCalculator extends PerformanceCalculator {

}

class PerformanceCalculator {
    constructor(aPerformance, aPlay) {
        this.performance = aPerformance;
        this.play = aPlay;
    }

    get amount() {  // amountFor 함수의 코드를 계산기 클래스로 복사
        let result = 0;
        switch(this.play.type) {    // 매개변수로 받던 정보를 계산기 필드에서 바로 얻음
        case "tragedy" :    // 비극
            throw '오류 발생'   // TragedyCalculator를 이용하도록 유도
            break;
        case "comedy" :
            result = 30000;
            if(this.performance.audience > 20){
                result += 10000 + 500 * (this.performance.audience - 20);
            }
            result += 300 * this.performance.audience;
            break;
        default:
            throw new Error('알 수 없는 경로: ${this.play.type}');
        }
    
        return result;
    }

    get volumeCredits() {
        let result = 0;
        result += Math.max(this.performance.audience - 30, 0);
        if("comedy" === this.play.type)
            result += Math.floor(this.performance.audience / 5);
        return result;
    }
}


function totalAmount(data) {
    let result = 0;
    // for (let perf of data.performances) {
    //     result += perf.amount;
    // }
    // return result;
    return data.performances
        .reduce((total, p) => total + p.amount, 0);
}

function totalVolumeCredits(data) {
    // let result = 0;
    // for (let perf of data.performances) {
    //     result += perf.volumeCredits;    // 추출한 함수를 통해 값을 누적
    // }
    // return result;
    return data.performances
        .reduce((total, p) => total + p.volumeCredits, 0);
}


function volumeCreditsFor(aPerformance) {
    return new PerformanceCalculator(aPerformance, playFor(aPerformance)).volumeCredits;
}

function playFor(aPerformance) {
    return plays[aPerformance.playID];
}

function amountFor(aPerformance) {
    return new PerformanceCalculator(aPerformance, playFor(aPerformance)).amount;
}