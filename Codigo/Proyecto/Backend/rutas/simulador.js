const express = require("express");
const router = express.Router(); // ← nombre local cualquiera

router.post("/", (req, res) => {
  const {
    principal, months, rateAnnual, rateType = "TNA",
    system = "frances",
    startDate = new Date().toISOString(),
    monthlyExtra = 0,
    upfrontFee = 0,
    prepayment = null
  } = req.body || {};

  if (!principal || !months || !rateAnnual) {
    return res.status(400).json({ error: "Faltan campos requeridos" });
  }

  const i = rateType === "TEA"
    ? Math.pow(1 + rateAnnual, 1/12) - 1
    : rateAnnual / 12;

  const schedule = [];
  let saldo = Number(principal);
  const n = Number(months);

  const makeRow = (idx, saldoIni, interes, amort, extra) => {
    const cuota = (amort + interes) + extra;
    const saldoFin = Math.max(0, saldoIni - amort);
    const baseDate = new Date(startDate);
    baseDate.setMonth(baseDate.getMonth() + (idx - 1));
    return {
      month: idx,
      date: baseDate.toISOString().slice(0, 10),
      saldoInicial: +saldoIni.toFixed(2),
      interes: +interes.toFixed(2),
      amortizacion: +amort.toFixed(2),
      extra: +extra.toFixed(2),
      cuota: +cuota.toFixed(2),
      saldoFinal: +saldoFin.toFixed(2),
    };
  };

  let cuotaBase = 0;

  if (system === "frances") {
    cuotaBase = saldo * (i / (1 - Math.pow(1 + i, -n)));
    for (let m = 1; m <= n; m++) {
      const interes = saldo * i;
      let amort = cuotaBase - interes;
      if (prepayment && prepayment.month === m && prepayment.amount > 0) {
        amort += prepayment.amount;
      }
      const row = makeRow(m, saldo, interes, amort, monthlyExtra);
      schedule.push(row);
      saldo = row.saldoFinal;
      if (saldo <= 0) break;
    }
  } else if (system === "aleman") {
    const amortFija = principal / n;
    for (let m = 1; m <= n; m++) {
      const interes = saldo * i;
      let amort = amortFija;
      if (prepayment && prepayment.month === m && prepayment.amount > 0) {
        amort += prepayment.amount;
      }
      const row = makeRow(m, saldo, interes, amort, monthlyExtra);
      schedule.push(row);
      saldo = row.saldoFinal;
      if (saldo <= 0) break;
    }
  } else if (system === "bullet") {
    for (let m = 1; m <= n; m++) {
      const interes = saldo * i;
      let amort = (m === n) ? saldo : 0;
      if (prepayment && prepayment.month === m && prepayment.amount > 0) {
        amort += prepayment.amount;
      }
      const row = makeRow(m, saldo, interes, amort, monthlyExtra);
      schedule.push(row);
      saldo = row.saldoFinal;
    }
  }

  const totInteres = schedule.reduce((s, r) => s + r.interes, 0);
  const totExtras  = schedule.reduce((s, r) => s + r.extra, 0);
  const totCuotas  = schedule.reduce((s, r) => s + r.cuota, 0);
  const costoTotal = upfrontFee + totCuotas;

  res.json({
    ok: true,
    inputs: { principal, months, rateAnnual, rateType, monthlyExtra, upfrontFee, system, prepayment },
    rateMonthly: +i.toFixed(8),
    cuotaBase: system === "frances" ? +cuotaBase.toFixed(2) : null,
    totals: {
      interes: +totInteres.toFixed(2),
      extras: +totExtras.toFixed(2),
      cuotas: +totCuotas.toFixed(2),
      costoTotal: +costoTotal.toFixed(2)
    },
    schedule
  });
});

module.exports = router; // ← exporta el router DIRECTO