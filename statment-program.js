function statment(invoice, plays) {
    let totalAmount = 0;
    let volumeCredits = 0;
    let result = '청구 내역 (고객명: ${invoice.customer})\n'
    const format = new Intl.NumberFormat("en-Us",
                        {style: "currency", currency: "USD",
                    minimumFractionDigits: 2}).format;

    for (let perf of invoice.performances) {

        volumeCredits += volumeCreditsFor(perf);    // 추출한 함수를 통해 값을 누적
        
        // 청구 내역을 출력한다.
        result += ' ${playFor(perf).name}: ${format(amoutFor(perf)/100)} ($perf.audience}석\n';
        totalAmount += amoutFor(perf);
    }

    result += '총액: ${format(totalAmount/100)}\n';
    result += '적립 포인트: ${volumeCredits}점\n';
    return result;
}


function amoutFor(aPerformance) {
    let result = 0;

    switch(playFor(aPerformance).type) {
    case "tragedy" :    // 비극
        result = 40000;
        if(aPerformance.audience > 30){
            result += 1000 * (aPerformance.audience - 30);
        }
        break;
    case "comedy" :
        result = 30000;
        if(aPerformance.audience > 20){
            result += 10000 + 500 * (aPerformance.audience - 20);
        }
        result += 300 * aPerformance.audience;
        break;
    default:
        throw new Error('알 수 없는 경로: ${playFor(aPerformance).type}');
    }

    return result;

}

function playFor(aPerformance) {
    return plays[aPerformance.playID];
}

function volumeCreditsFor(perf) {
    let volumeCredits = 0;
    volumeCredits += Math.max(perf.audience - 30, 0);
    if("comedy" === playFor(perf).type)
        volumeCredits += Math.floor(perf.audience / 5);
    return volumeCredits;

}