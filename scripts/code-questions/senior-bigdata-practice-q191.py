import io, contextlib
from scipy import stats

code = '''p_at_least_8 = stats.binom.sf(8, 10, 0.6)
print(round(p_at_least_8, 4))'''
buf = io.StringIO()
with contextlib.redirect_stdout(buf):
    exec(code, {"stats": stats})
out = buf.getvalue().strip()
assert out == "0.0464", out
# D（正解）0.0464 = P(X>8) = P(9)+P(10)
assert round(stats.binom.pmf(9, 10, .6) + stats.binom.pmf(10, 10, .6), 4) == 0.0464
# A 0.1673 才是真正的「至少 8 人」= sf(7)
assert round(stats.binom.sf(7, 10, .6), 4) == 0.1673 != float(out)
# B 0.1209 是恰好 8 人
assert round(stats.binom.pmf(8, 10, .6), 4) == 0.1209 != float(out)
# C 0.9536 是 cdf(8) = P(X≤8)
assert round(stats.binom.cdf(8, 10, .6), 4) == 0.9536 != float(out)
print("OK", "senior-bigdata-practice-q191")
