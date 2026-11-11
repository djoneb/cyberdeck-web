import re, json, sys
D='/home/user/Cyber-punk-launcher-/app/src/main/java/com/cyberdeck/launcher/data/'
class P:
    def __init__(s,t,i): s.t=t; s.i=i
    def ws(s):
        while True:
            while s.i<len(s.t) and s.t[s.i] in ' \t\r\n': s.i+=1
            if s.t.startswith('//',s.i): s.i=s.t.index('\n',s.i)
            else: return
    def expr(s):
        a=s.atom(); s.ws()
        if re.match(r'to\b',s.t[s.i:]): s.i+=2; b=s.expr(); return ('pair',a,b)
        return a
    def atom(s):
        s.ws(); t=s.t; c=t[s.i]
        def lit(i0):
            j=i0+1; out=''
            while t[j]!='"':
                if t[j]=='\\': out+={'n':'\n','"':'"','\\':'\\','t':'\t'}.get(t[j+1],t[j+1]); j+=2
                else: out+=t[j]; j+=1
            return out, j+1
        if c=='"':
            v,s.i=lit(s.i)
            # concaténation "a" + "b"
            while True:
                k=s.i
                while k<len(t) and t[k] in ' \t\r\n': k+=1
                if t.startswith('+',k):
                    s.i=k+1; s.ws()
                    if t[s.i]=='"': w,s.i=lit(s.i); v+=w; continue
                    s.i=k
                break
            return v
        m=re.match(r'0x[0-9A-Fa-f]+L?',t[s.i:])
        if m: s.i+=len(m.group()); h=m.group().rstrip('L'); return '#'+h[-6:].lower()
        m=re.match(r'-?\d+(\.\d+)?f?',t[s.i:])
        if m: s.i+=len(m.group()); g=m.group().rstrip('f'); return float(g) if '.' in g else int(g)
        m=re.match(r'[A-Za-z_][A-Za-z0-9_.]*',t[s.i:])
        name=m.group(); s.i+=len(name); s.ws()
        if name in('true','false'): return name=='true'
        if name=='null': return None
        if t[s.i]=='(':
            s.i+=1; args=[]
            while True:
                s.ws()
                if t[s.i]==')': s.i+=1; break
                m2=re.match(r'([a-z][A-Za-z]*)\s*=(?!=)',t[s.i:])
                if m2: s.i+=len(m2.group())
                v=s.expr(); args.append(('named',m2.group(1),v) if m2 else v); s.ws()
                if t[s.i]==',': s.i+=1
            if name in('listOf','setOf'): return args
            if name=='mapOf': return {k:v for _,k,v in args}
            return (name,args)
        return ('ident',name)
def grab(f,marker):
    t=open(D+f).read(); i=t.index(marker)+len(marker); return P(t,i).expr()
def obj(x,fields):
    o={}; pos=[a for a in x[1] if not (isinstance(a,tuple) and a and a[0]=='named')]
    o.update(zip(fields,pos))
    for a in x[1]:
        if isinstance(a,tuple) and a and a[0]=='named': o[a[1]]=a[2]
    return o
contacts=[obj(c,['id','name','role','emblem','gigs','romance','hello','offer','thanks','idle','close']) for c in grab('Contacts.kt','val CONTACTS = ')]
gigs={k:obj(v,['event','desc','xp']) for k,v in grab('Contacts.kt','val TYPES = ').items()}
exps=[obj(e,['id','contactId','title','place','minutes','brief','report']) for e in grab('Batch8.kt','val ALL = ')]
runners=grab('Batch8.kt','RUNNER_NAMES = ')
places=[obj(p,['id','name','desc','icon','color','regulars','mood']) for p in grab('Batch8.kt','val PLACES = ')]
def enc(e):
    o=obj(e,['kind','who','contactId','text','choices']); o['choices']=[obj(c,['label','result','xp','eddies','aff']) for c in o['choices']]; return o
strangers=[enc(e) for e in grab('Batch8.kt','STRANGERS = ')]
districts=[obj(d,['id','name','color']) for d in grab('Batch9.kt','val DISTRICTS = ')]
spots=[obj(d,['placeId','x','y','district','open','close']) for d in grab('Batch9.kt','val SPOTS = ')]
events=[obj(d,['text','safe','risky']) for d in grab('Batch9.kt','val POOL = ')]
chains={k:[obj(e,['title','place','minutes','brief','report']) for e in v] for k,v in grab('Batch9.kt','val CHAINS: Map<String, List<ChainEp>> = ').items()}
need=grab('Batch9.kt','val NEED = ')
chromes=[obj(c,['id','name','desc','level']) for c in grab('Batch6.kt','object Chromes {\n    val ALL = ')]
sms=grab('Batch6.kt','private val LINES = ')
secrets=grab('Batch6.kt','val SECRETS = ')
convos=[]
for c in grab('Batch6.kt','object HoloConvos {\n    private fun c(me: String, reply: String, aff: Int, xp: Int) = ConvoChoice(me, reply, aff, xp)\n    val ALL = '):
    o=obj(c,['id','contactId','text','choices']); o['choices']=[dict(zip(['me','reply','aff','xp'],x[1])) for x in o['choices']]; convos.append(o)
dplaces=[obj(d,['id','name','desc','minutes','xp','bond']) for d in grab('Batch6.kt','object Romance {\n    val PLACES = ')]
titles=grab('Batch6.kt','private val TITLES = ')
dlines=grab('Batch6.kt','private val DATE_LINES = ')
gifts=[obj(d,['id','name','desc']) for d in grab('Batch6.kt','val GIFTS = ')]
items=[obj(d,['id','name','desc','price','consumable','kind']) for d in grab('Batch5.kt','object Eddies {\n    val ITEMS = ')]
for it in items: it.setdefault('consumable',False); it.setdefault('kind','look')
achievements=[obj(a,['id','title','desc']) for a in grab('Achievements.kt','val ALL = ')]
secrets_list=[obj(a,['id','title','hint','reveal']) for a in grab('Batch7.kt','object Secrets {\n    val ALL = ')]
challenges=[obj(a,['id','text','goal']) for a in grab('Batch7.kt','object WeeklyChallenges {\n    val POOL = ')]
cityevents=[obj(a,['id','name','desc','task','event','xp','color']) for a in grab('Batch6.kt','object CityEvents {\n    val ALL = ')]
chapters=[obj(a,['id','title','goal','text']) for a in grab('Batch5.kt','val CHAPTERS = ')]
out={'CONTACTS':contacts,'GIGS':gigs,'EXPEDITIONS':exps,'RUNNER_NAMES':runners,'PLACES':places,'STRANGERS':strangers,'DISTRICTS':districts,'SPOTS':spots,'EXP_EVENTS':events,'CHAINS':chains,'CHAIN_NEED':need,'CHROMES':chromes,'SMS_LINES':sms,'SECRETS':secrets,'CONVOS':convos,'DATE_PLACES':dplaces,'BOND_TITLES':titles,'DATE_LINES':dlines,'GIFTS_R':gifts,'ITEMS':items,'ACHIEVEMENTS':achievements,'SECRETS_LIST':secrets_list,'CHALLENGES':challenges,'CHAPTERS':chapters,'CITY_EVENTS':cityevents}
with open(sys.argv[1],'w') as f:
    f.write('// Généré depuis le code du launcher (scripts/ktdata.py) : ne pas modifier à la main.\n')
    for k,v in out.items(): f.write(f'export const {k} = {json.dumps(v,ensure_ascii=False)};\n')
print({k:len(v) for k,v in out.items()})
