import { normalizeString, searchExactSubstring } from "../utils/reconciliation";

test("test normalize no change", function() {
    expect(normalizeString("hopital")).toEqual("hopital");
});

test("test normalize case change", function() {
    expect(normalizeString("Hopital")).toEqual("hopital");
});

test("test normalize accented change", function() {
    expect(normalizeString("hôpital")).toEqual("hopital");
});

test("test normalize all cases", function() {
    expect(normalizeString("Hôpital")).toEqual("hopital");
});

test("searchExactSubstring match exact", function() {
    expect(searchExactSubstring("hopital", "hopital"))
        .toEqual({
            result: "hopital",
            from: 0,
            to: 6
        });
});

test("searchExactSubstring match exact substring", function() {
    expect(searchExactSubstring("aller à l'hopital à Rennes", "hopital"))
        .toEqual({
            result: "hopital",
            from: 10,
            to: 16
        });
});

test("searchExactSubstring match case sensitive substring", function() {
    expect(searchExactSubstring("aller à l'Hopital à Rennes", "hopiTal"))
        .toEqual({
            result: "Hopital",
            from: 10,
            to: 16
        });
});

test("searchExactSubstring match accent sensitive substring", function() {
    expect(searchExactSubstring("aller à l'hôpital à Rennes", "hopital"))
        .toEqual({
            result: "hôpital",
            from: 10,
            to: 16
        });
});
