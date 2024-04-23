import { db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

export const testData = [
  {
    name: "Dolo",
    brand: "MICRO LABS",
    dosage: "650mg",
    stock: "",
    price: 33.6,
    tabCount: 15,
    type: "tablet",
    description:
      "Dolo 650 tablet contains an active ingredient called paracetamol, which works by blocking the formation of certain chemicals that cause pain and fever in the body. This medicine is used to treat various conditions such as headache, backache, migraine, toothache, body pain, and even fever associated with diseases like typhoid or the common cold.",
    prescriptionRequired: 0,
    category: "cold,flu",
    indication: "Pain and fever",
    sideEffects: "Skin rash, itching, blisters",
    therapy: "analgestic,antipyretic",
    "Reference link": "https://pharmeasy.in/online-medicine-order/44140",
  },
  {
    name: "Paracip",
    brand: "CIPLA GX",
    dosage: "650mg",
    stock: "",
    price: 22.51,
    tabCount: 10,
    type: "tablet",
    description:
      "Paracip 650 tablet is a painkiller medicine. It is used to reduce fever and relieve pain. Paracip 650 contains paracetamol which is also known as acetaminophen. Paracetamol in Paracip 650 works by inhibiting the action of certain substances which cause pain and act on the brain centre which is responsible for controlling body temperature. Chances of getting side effects with Paracip 650 are mostly rare, but sometimes you may experience skin rash or itching.",
    prescriptionRequired: 0,
    category: "cold,flu",
    indication: "Pain and fever",
    sideEffects: "Skin rash, itching, blisters, allergic reaction",
    therapy: "analgestic,antipyretic",
    "Reference link":
      "https://pharmeasy.in/online-medicine-order/paracip-650mg-tablet-6878",
  },
  {
    name: "Paracip",
    brand: "CIPLA GX",
    dosage: "500mg",
    stock: "",
    price: 9.96,
    tabCount: 10,
    type: "tablet",
    description:
      "Paracip 500 tablet is used to reduce fever and relieve pain. It contains paracetamol (also known as Acetaminophen) as its active ingredient. It is used for reducing fever and relieving pain, including toothache, headache, migraine, muscle ache, period pain, etc.",
    prescriptionRequired: 0,
    category: "cold,flu",
    indication: "Pain and fever",
    sideEffects: "Skin rash, itching, blisters, allergic reaction",
    therapy: "analgestic,antipyretic",
    "Reference link":
      "https://pharmeasy.in/online-medicine-order/paracip-500mg-tablet-6879",
  },
  {
    name: "Crocin",
    brand: "GLAXOSMITHKLINE",
    dosage: "650mgAdvanced",
    stock: "",
    price: 33.6,
    tabCount: 15,
    type: "tablet",
    description:
      "Crocin 650 Advance tablet is a pain-relieving medicine. It contains paracetamol as an active ingredient. It is used for reducing fever and relieving pain, including toothache, headache, migraine, muscle ache, period pain, etc. Pain is an unpleasant feeling caused by the formation of certain chemicals in the body in response to an injury, tissue damage or disease. Crocin 650 Advance tablet works by blocking the formation of these chemicals responsible for fever and pain. This medicine usually provides symptomatic relief to the patient taking this medicine.",
    prescriptionRequired: 0,
    category: "cold,flu",
    indication: "Pain and fever",
    sideEffects: "",
    therapy: "analgestic,antipyretic",
    "Reference link":
      "https://pharmeasy.in/health-care/products/calpol-650mg-strip-of-15-tablets-217263",
  },
  {
    name: "Crocin",
    brand: "GLAXOSMITHKLINE",
    dosage: "650mg",
    stock: "",
    price: 33.6,
    tabCount: 15,
    type: "tablet",
    description:
      "Crocin 650 Advance tablet is a pain-relieving medicine. It contains paracetamol as an active ingredient. It is used for reducing fever and relieving pain, including toothache, headache, migraine, muscle ache, period pain, etc. Pain is an unpleasant feeling caused by the formation of certain chemicals in the body in response to an injury, tissue damage or disease. Crocin 650 Advance tablet works by blocking the formation of these chemicals responsible for fever and pain. This medicine usually provides symptomatic relief to the patient taking this medicine.",
    prescriptionRequired: 0,
    category: "cold,flu",
    indication: "Pain and fever",
    sideEffects: "",
    therapy: "analgestic,antipyretic",
    "Reference link":
      "https://pharmeasy.in/health-care/products/crocin-650-strip-of-15-tablets-3626228",
  },
  {
    name: "Lanol Er",
    brand: "HETERO HEALTHCARE LIMITED",
    dosage: "650mg",
    stock: "",
    price: 22.4,
    tabCount: 10,
    type: "tablet",
    description:
      "Lanol ER 650 tablet is used to reduce fever and relieve pain. It contains paracetamol (also known as Acetaminophen) as its active ingredient. It works by inhibiting the action of certain substances which cause pain and acts on the brain centre, which is responsible for controlling body temperature.",
    prescriptionRequired: 0,
    category: "cold,flu",
    indication: "Pain and fever",
    sideEffects: "Skin rash, itching, blisters",
    therapy: "analgestic,antipyretic",
    "Reference link":
      "https://pharmeasy.in/online-medicine-order/calpol-650mg-strip-of-15-tablets-12678",
  },
  {
    name: "P",
    brand: "APEX LABORATORIES PRIVATE LIMITED",
    dosage: "",
    stock: "",
    price: 22.51,
    tabCount: 10,
    type: "tablet",
    description:
      "The P 650 tablet is a medication used to relieve fever and pain caused by various conditions such as headache, migraine, muscle aches, period pain, sore throat, musculoskeletal pain, fever/pain after vaccination or immunization, pain after dental procedures, toothache, earache, respiratory tract infections, cold and flu, and osteoarthritis pain. It contains paracetamol, which is also known as acetaminophen and works by blocking the release of a chemical that triggers pain and fever in the body. To ensure maximum effectiveness and safety, it is important to take this medicine in the exact dose and duration as directed. Do not exceed the recommended dose, and avoid taking more than four doses within a 24-hour period. It is necessary to maintain a minimum gap of four hours between each dose.",
    prescriptionRequired: 0,
    category: "cold,flu",
    indication: "Pain and fever",
    sideEffects: "Skin rash",
    therapy: "",
    "Reference link":
      "https://pharmeasy.in/online-medicine-order/calpol-650mg-strip-of-15-tablets-169787",
  },
  {
    name: "Crocin",
    brand: "GLAXOSMITHKLINE",
    dosage: "500mgAdvanced",
    stock: "",
    price: 19.93,
    tabCount: 15,
    type: "tablet",
    description:
      "Crocin Advance tablet is a pain-relieving medicine. It contains paracetamol as an active ingredient. This medicine is used for reducing fever and relieving pain, including toothache, headache, migraine, muscle ache, period pain, etc. Crocin Advance tablet provides fast and effective relief from pain.",
    prescriptionRequired: 0,
    category: "cold,flu",
    indication: "Pain and fever",
    sideEffects: "",
    therapy: "analgestic,antipyretic",
    "Reference link":
      "https://pharmeasy.in/online-medicine-order/crocin-advance-500mg-strip-of-15-tablets-42306",
  },
  {
    name: "Calpol",
    brand: "GLAXOSMITHKLINE",
    dosage: "500mg",
    stock: "",
    price: 14.95,
    tabCount: 15,
    type: "tablet",
    description:
      "Calpol 500 mg tablet is a pain-relieving medicine. It contains paracetamol as an active ingredient. Calpol is used for reducing fever and relieving pain, including toothache, headache, migraine, muscle ache, period pain, etc. Paracetamol works by inhibiting the action of certain substances that cause pain and acting on the brain centre that regulates body temperature. Although side effects from Calpol 500 are uncommon, you may experience skin rash or itching.",
    prescriptionRequired: 0,
    category: "cold,flu",
    indication: "Pain and fever",
    sideEffects: "Skin rash, itching, blisters",
    therapy: "analgestic,antipyretic",
    "Reference link":
      "https://pharmeasy.in/online-medicine-order/calpol-500mg-strip-of-15-tablets-38810",
  },
  {
    name: "Pyrigesic",
    brand: "EAST INDIA PHARMA WORKS LTD",
    dosage: "500mg",
    stock: "",
    price: 11.31,
    tabCount: 10,
    type: "tablet",
    description:
      "Pyrigesic 500 tablet is used to reduce fever and relieve pain. It is a painkiller containing paracetamol (also known as Acetaminophen) as its active ingredient. It is a painkiller medicine. Paracetamol works by inhibiting the action of certain substances that causes pain and act on the brain centre which is responsible for controlling body temperature. While taking this medicine, you should not take other medicines containing paracetamol. Do not take more than the recommended dose and keep a gap of a minimum of 4 hours between two consecutive doses. You should take Pyregesic with or after meals to avoid stomach upset.",
    prescriptionRequired: 0,
    category: "cold,flu",
    indication: "Pain and fever",
    sideEffects: "Skin rash, itching, blisters",
    therapy: "analgestic,antipyretic",
    "Reference link":
      "https://pharmeasy.in/online-medicine-order/pyrigesic-500mg-tablet-172647",
  },
  {
    name: "Teplota",
    brand: "",
    dosage: "500mg",
    stock: "",
    price: 14.95,
    tabCount: 15,
    type: "tablet",
    description:
      "Teplota Tablet is used to provide temporary relief from fever, pain and aches. It contains paracetamol, also known as acetaminophen which is an analgesics (painkillers) or antipyretic (medicines used to reduce fever). Paracetamol stops the release of a natural chemical substance, prostaglandins responsible for pain and fever. You should not take more than 4-Tablets of the Teplota Tablet in 24 hours. Take Teplota with food to avoid stomach upset.",
    prescriptionRequired: 0,
    category: "cold,flu",
    indication: "Pain and fever",
    sideEffects: "Skin rash, itching, blisters",
    therapy: "analgestic,antipyretic",
    "Reference link":
      "https://pharmeasy.in/online-medicine-order/teplota-500mg-strip-of-15-tablets-2986154",
  },
  {
    name: "Cyclopam",
    brand: "INDOCO REMEDIES LTD",
    dosage: "",
    stock: "",
    price: "",
    tabCount: "",
    type: "",
    description: "",
    prescriptionRequired: "",
    category: "",
    indication: "",
    sideEffects: "",
    therapy: "",
    "Reference link": "",
  },
  {
    name: "",
    brand: "",
    dosage: "",
    stock: "",
    price: "",
    tabCount: "",
    type: "",
    description: "",
    prescriptionRequired: "",
    category: "",
    indication: "",
    sideEffects: "",
    therapy: "",
    "Reference link": "",
  },
  {
    name: "Metrogyl",
    brand: "J B CHEMICALS AND PHARMACEUTICALS",
    dosage: "400mg",
    stock: "",
    price: 25.53,
    tabCount: 15,
    type: "tablet",
    description:
      "Metrogyl 400mg tablet is used to treat diarrhoea, dysentery, and infections caused by parasites, bacteria, and microorganisms. It contains metronidazole, which inhibits the growth of harmful organisms and prevents the spread of infection. You should take the Metrogyl 400 tablet as advised by your doctor for the prescribed duration. It is recommended to take this tablet with meals to avoid stomach upset. You should always complete the course of treatment with this medicine. Incomplete treatment may result in treatment failure and increase the risk of re-infection. Do not miss any dose or stop taking Metrogyl 400 tablets alone.",
    prescriptionRequired: 0,
    category: "gastric,diarrhoea, dysentery",
    indication: "Bacterial and prasitic infections",
    sideEffects:
      "Headache, vomiting, diarrhea, abdominal cramps, metallic taste",
    therapy: "antiAmoebic",
    "Reference link":
      "https://pharmeasy.in/online-medicine-order/metrogyl-400mg-strip-of-15-tablets-15185",
  },
  {
    name: "Metrogyl",
    brand: "J B CHEMICALS AND PHARMACEUTICALS",
    dosage: "200mg",
    stock: "",
    price: 18.33,
    tabCount: 15,
    type: "",
    description:
      "Metrogyl Tablet is an anti-infective medicine. It is used in treating infections of various parts of the body caused by many microorganisms, including bacteria and amoeba-like organisms (protozoan parasites). Metrogyl Tablet contains metronidazole as its active ingredient. This medicine is not recommended to be used by pregnant women and lactating mothers and should be used with caution in elderly patients. Metrogyl Tablet should be taken as instructed by the doctor. You should complete the entire treatment with this medicine as prescribed by the doctor and not stop taking this medicine abruptly, even if you feel better.",
    prescriptionRequired: "",
    category: "gastric,diarrhoea, dysentery",
    indication: "Bacterial and prasitic infections",
    sideEffects:
      "Headache, vomiting, diarrhea, abdominal cramps, metallic taste",
    therapy: "antiAmoebic",
    "Reference link":
      "https://pharmeasy.in/online-medicine-order/metrogyl-400mg-strip-of-15-tablets-15184",
  },
  {
    name: "Metron",
    brand: "ALKEM LABORATORIES LTD",
    dosage: "400mg",
    stock: "",
    price: 25.54,
    tabCount: 15,
    type: "",
    description:
      "Metron Tablet is an anti-infective medicine. It is used in treating infections of various parts of the body caused by many microorganisms, including bacteria and amoeba-like organisms (protozoan parasites). Metron Tablet contains metronidazole as its active ingredient. This medicine is not recommended to be used by pregnant women and lactating mothers and should be used with caution in elderly patients. Metron Tablet should be taken as instructed by the doctor. You should complete the entire treatment with this medicine as prescribed by the doctor and not stop taking this medicine abruptly, even if you feel better.",
    prescriptionRequired: "",
    category: "gastric,diarrhoea, dysentery",
    indication: "Bacterial and prasitic infections",
    sideEffects:
      "Headache, vomiting, diarrhea, abdominal cramps, metallic taste",
    therapy: "antiAmoebic",
    "Reference link":
      "https://pharmeasy.in/online-medicine-order/metron-400mg-strip-of-15-tablets-3119580",
  },
  {
    name: "Metropar",
    brand: "",
    dosage: "400mg",
    stock: "",
    price: 69.37,
    tabCount: 10,
    type: "",
    description:
      "Metropar Tablet is an anti-infective medicine. It is used in treating infections of various parts of the body caused by many microorganisms, including bacteria and amoeba-like organisms (protozoan parasites). Metropar Tablet contains metronidazole as its active ingredient. This medicine is not recommended to be used by pregnant women and lactating mothers and should be used with caution in elderly patients. Metropar Tablet should be taken as instructed by the doctor. You should complete the entire treatment with this medicine as prescribed by the doctor and not stop taking this medicine abruptly, even if you feel better.",
    prescriptionRequired: "",
    category: "gastric,diarrhoea, dysentery",
    indication: "Bacterial and prasitic infections",
    sideEffects:
      "Headache, vomiting, diarrhea, abdominal cramps, metallic taste",
    therapy: "antiAmoebic",
    "Reference link":
      "https://pharmeasy.in/online-medicine-order/metropar-400mg-tab-10-s-210720",
  },
  {
    name: "Flagyl",
    brand: "ABBOTT HEALTHCARE PVT LTD",
    dosage: "400mg",
    stock: "",
    price: 25.53,
    tabCount: 15,
    type: "",
    description:
      "Flagyl 400 tablet is a medication used to treat infections caused by bacteria and parasites. It is used to treat infections of the liver, stomach, intestines, vagina, brain, heart, lungs, bones, and skin. It can also be used to prevent infection after a surgery or operation. The active ingredient in Flagyl 400 tablet is metronidazole, which works by stopping the growth of the bacteria or parasite responsible for the infection by interrupting its essential processes.",
    prescriptionRequired: "",
    category: "gastric,diarrhoea, dysentery",
    indication: "Bacterial and prasitic infections",
    sideEffects:
      "Headache, vomiting, diarrhea, abdominal cramps, metallic taste",
    therapy: "antiAmoebic",
    "Reference link":
      "https://pharmeasy.in/online-medicine-order/flagyl-400mg-strip-of-15-tablets-47294",
  },
  {
    name: "Metrocon",
    brand: "CONCEPT PHARMACEUTICALS LTD",
    dosage: "400mg",
    stock: "",
    price: 18,
    tabCount: 10,
    type: "",
    description:
      "Metrocon Tablet is an anti-infective medicine. It is used in treating infections of various parts of the body caused by many microorganisms, including bacteria and amoeba-like organisms (protozoan parasites). Metrocon Tablet contains metronidazole as its active ingredient. This medicine is not recommended to be used by pregnant women and lactating mothers and should be used with caution in elderly patients. Metrocon Tablet should be taken as instructed by the doctor. You should complete the entire treatment with this medicine as prescribed by the doctor and not stop taking this medicine abruptly, even if you feel better.",
    prescriptionRequired: "",
    category: "gastric,diarrhoea, dysentery",
    indication: "Bacterial and prasitic infections",
    sideEffects:
      "Headache, vomiting, diarrhea, abdominal cramps, metallic taste",
    therapy: "antiAmoebic",
    "Reference link":
      "https://pharmeasy.in/online-medicine-order/metrocon-400mg-tab-185292",
  },
  {
    name: "Aristogyl",
    brand: "ARISTO PHARMACEUTICALS PVT LTD",
    dosage: "400mg",
    stock: "",
    price: 16.77,
    tabCount: 10,
    type: "",
    description:
      "Aristogyl Tablet is an anti-infective medicine. It is used in treating infections of various parts of the body caused by many microorganisms, including bacteria and amoeba-like organisms (protozoan parasites). Aristogyl Tablet contains metronidazole as its active ingredient. This medicine is not recommended to be used by pregnant women and lactating mothers and should be used with caution in elderly patients. Aristogyl Tablet should be taken as instructed by the doctor. You should complete the entire treatment with this medicine as prescribed by the doctor and not stop taking this medicine abruptly, even if you feel better.",
    prescriptionRequired: "",
    category: "gastric,diarrhoea, dysentery",
    indication: "Bacterial and prasitic infections",
    sideEffects:
      "Headache, vomiting, diarrhea, abdominal cramps, metallic taste",
    therapy: "antiAmoebic",
    "Reference link":
      "https://pharmeasy.in/online-medicine-order/aristogyl-400mg-tablet-35344",
  },
  {
    name: "Combiflam",
    brand: "SANOFI",
    dosage: "",
    stock: "",
    price: 50.65,
    tabCount: 20,
    type: "",
    description:
      "Combiflam tablets are a commonly used painkiller medication that helps to treat various conditions, including headaches, toothaches, body aches, muscle pain, joint pain, and fever. The active ingredients in Combiflam are Ibuprofen and paracetamol. Combiflam works by blocking the release of certain chemical messengers that cause pain, fever, as well as inflammation (redness and swelling). To ensure the best results, Combiflam should be taken as prescribed by a doctor, with or after food, for the recommended duration. It is important to follow the prescribed dose and not skip any doses or take more than advised.",
    prescriptionRequired: "",
    category: "cold,flu",
    indication: "Pain and fever",
    sideEffects: "Nausea, rashes, indigestion, vomiting",
    therapy: "analgestic,antipyretic",
    "Reference link":
      "https://pharmeasy.in/online-medicine-order/combiflam-strip-of-20-tablets-24074",
  },
  {
    name: "Ibugesic Plus",
    brand: "CIPLA LIMITED",
    dosage: "",
    stock: "",
    price: 33.27,
    tabCount: 20,
    type: "",
    description:
      "Ibugesic Plus tablet is a pain-relieving medicine. It is used to reduce pain in headaches, toothache, body aches, muscle pain and joint pain and to reduce fever. It is a combination medicine containing ibuprofen and paracetamol as active components. This medicine works by inhibiting the formation of certain chemicals responsible for fever, pain, and inflammation. It should be taken as directed by the doctor and in doses and duration as prescribed. It should preferably be taken after meals. Combiflam tablet, Flexon tablet, and Imol Plus tablet also contain the same composition as Ibugesic Plus tablet.",
    prescriptionRequired: "",
    category: "",
    indication: "",
    sideEffects: "Nausea, rashes, indigestion, vomiting",
    therapy: "analgestic,antipyretic",
    "Reference link":
      "https://pharmeasy.in/online-medicine-order/ibugesic-plus-strip-of-20-tablets-206913",
  },
  {
    name: "Imol",
    brand: "ZYDUS HEALTHCARE LIMITED",
    dosage: "400mg",
    stock: "",
    price: 8.65,
    tabCount: 10,
    type: "",
    description:
      "Imol 400 tablet is a pain-relieving medicine. It is a combination medicine containing ibuprofen and paracetamol as its active component. Imol tablet is used to relieve headache, toothache, body ache",
    prescriptionRequired: "",
    category: "",
    indication: "",
    sideEffects: "Stomach pain, diarrhoea, vomiting, bloating",
    therapy: "analgestic,antipyretic",
    "Reference link":
      "https://pharmeasy.in/online-medicine-order/imol-400mg-tablet-30559",
  },
  {
    name: "Flexon",
    brand: "ARISTO PHARMACEUTICALS PVT LTD",
    dosage: "",
    stock: "",
    price: 31.4,
    tabCount: 15,
    type: "",
    description:
      "Flexon tablet is manufactured by Aristo Pharmaceuticals Pvt Ltd. It is used to treat painful periods, dental pain, pain due to injury, sprain, fever, strain and post-operative pain. Flexon tablet contains a combination of ibuprofen and paracetamol as its active ingredients. It works by preventing the release of certain chemical messengers that cause fever, pain and inflammation.",
    prescriptionRequired: "",
    category: "",
    indication: "Pain, inflammation, fever",
    sideEffects: "Nausea, headache, indigestion, vomiting",
    therapy: "analgestic,antipyretic",
    "Reference link":
      "https://pharmeasy.in/online-medicine-order/flexon-strip-of-15-tablets-3689",
  },
  {
    name: "Ibuflamar P",
    brand: "INDOCO REMEDIES LTD",
    dosage: "400mg",
    stock: "",
    price: 27,
    tabCount: 15,
    type: "",
    description:
      "Ibuflamar P 400mg Strip Of 15 Tablets is a combination of Ibuprofen and Paracetamol, a pain-relieving medicine.",
    prescriptionRequired: "",
    category: "",
    indication: "",
    sideEffects: "",
    therapy: "",
    "Reference link":
      "https://pharmeasy.in/online-medicine-order/cobadex-czs-tab-15-s-50711",
  },
  {
    name: "Fenceta",
    brand: "ALKEM LABORATORIES LTD",
    dosage: "",
    stock: "",
    price: 29.59,
    tabCount: 15,
    type: "",
    description:
      "Fenceta Strip Of 15 Tablets is a combination of Ibuprofen and Paracetamol, a pain-relieving medicine.",
    prescriptionRequired: "",
    category: "",
    indication: "",
    sideEffects: "",
    therapy: "",
    "Reference link":
      "https://pharmeasy.in/online-medicine-order/cobadex-czs-tab-15-s-96004",
  },
  {
    name: "Rinifol Pedtabs",
    brand: "ELAN PHARMA(INDIA) PVT LTD",
    dosage: "",
    stock: "",
    price: 46.5,
    tabCount: 10,
    type: "",
    description:
      "Lactic Acid Bacillus(40.0 Ms) + Niacinamide / Nicotinamide(15.0 Mg) + Vitamin B9 / Folic Acid / Folate(100.0 Mcg) + Vitamin B6 / Pyridoxine(1.5 Mg) + Zinc(5.0 Mg)",
    prescriptionRequired: "",
    category: "multivitamin",
    indication: "",
    sideEffects: "",
    therapy: "generalMedicine",
    "Reference link":
      "https://pharmeasy.in/online-medicine-order/rinifol-pedtabs-strip-of-10-tablest-8977",
  },
  {
    name: "Rinilab",
    brand: "ELAN PHARMA(INDIA) PVT LTD",
    dosage: "",
    stock: "",
    price: 153,
    tabCount: 10,
    type: "",
    description: "Probiotics",
    prescriptionRequired: "",
    category: "multivitamin",
    indication: "",
    sideEffects: "",
    therapy: "prebiotic,probiotic",
    "Reference link":
      "https://pharmeasy.in/online-medicine-order/rinilab-cap-10-s-221836",
  },
  {
    name: "Eltroxin",
    brand: "GLAXOSMITHKLINE",
    dosage: "",
    stock: "",
    price: 177.41,
    tabCount: 120,
    type: "",
    description:
      "Eltroxin 100mcg tablet is used to control hypothyroidism. Hypothyroidism is a condition where the thyroid gland stops producing sufficient thyroid hormones. Eltroxin 100mcg tablet contains levothyroxine as the active component. Levothyroxine is a synthetic form of the thyroid hormone thyroxine produced naturally by the thyroid gland. Take this medicine in the exact dose and duration as recommended by your doctor. Do not take more than the prescribed dose. Do not stop taking this medicine on your own. Before taking Eltroxin 100mcg tablet, inform your doctor if you are pregnant, planning on becoming pregnant, breastfeeding and about your complete medical history.",
    prescriptionRequired: "",
    category: "hypothyroidism",
    indication: "hypothyroidism",
    sideEffects: "Headache, diarrhoea, vomiting, rashes",
    therapy: "hypothyroidism",
    "Reference link":
      "https://pharmeasy.in/online-medicine-order/eltroxin-100mcg-bottle-of-120-tablets-938389",
  },
  {
    name: "Thyronorm",
    brand: "ABBOTT INDIA LTD",
    dosage: "75mcg",
    stock: "",
    price: 192.88,
    tabCount: 120,
    type: "",
    description:
      "Thyronorm Tablet is used for the treatment of Hypothyroidism. It contains Levothyroxine as its active component. It is a synthetic form of a naturally occurring hormone known as Thyroxine produced by the thyroid gland. Hypothyroidism is a condition where the thyroid gland stops producing sufficient thyroid hormones. It is noticeable and characterized by lethargy, feeling tired, weight gain, constipation, muscle pain, hair loss, increased sensitivity to cold, feeling low and irregular menstrual cycle. This medicine should be used with care and caution in elder patients, patients with heart diseases and patients with disorders related to the adrenal gland. The dose and the duration should be strictly followed as recommended by the doctor. In case of any allergic reactions or any severe side effects contact your doctor as soon as possible.",
    prescriptionRequired: "",
    category: "hypothyroidism",
    indication: "hypothyroidism",
    sideEffects:
      "Increased appetite, hair loss, weight variations, headache, vomiting",
    therapy: "hypothyroidism",
    "Reference link":
      "https://pharmeasy.in/online-medicine-order/thyronorm-75mcg-tablet-120-s-174693",
  },
  {
    name: "Thyronorm",
    brand: "ABBOTT INDIA LTD",
    dosage: "50mcg",
    stock: "",
    price: 119.05,
    tabCount: 120,
    type: "",
    description:
      "Thyronorm 50 mcg tablet is used for the treatment of hypothyroidism. It contains levothyroxine as its active component. Levothyroxine is a synthetic form of the thyroid hormone thyroxine produced by the thyroid gland. Hypothyroidism is a condition where the thyroid gland stops producing sufficient thyroid hormones. Take Thyronorm in the morning and as advised by your doctor. This medicine should be taken without food, preferably after waking up. Thyronorm 50 should be used with caution in the elderly with heart diseases and adrenal gland disorders. The dose and the duration should be strictly followed as recommended by the doctor. In case of any allergic reactions or any severe side effects, contact your doctor as soon as possible.",
    prescriptionRequired: "",
    category: "hypothyroidism",
    indication: "hypothyroidism",
    sideEffects:
      "Increased appetite, hair loss, weight variations, headache, vomiting",
    therapy: "hypothyroidism",
    "Reference link":
      "https://pharmeasy.in/online-medicine-order/thyronorm-50mcg-bottle-of-120-tablets-175229",
  },
  {
    name: "Thyronorm",
    brand: "ABBOTT INDIA LTD",
    dosage: "25mcg",
    stock: "",
    price: 193.53,
    tabCount: 120,
    type: "",
    description:
      "Thyronorm 25 tablet is used for the treatment of hypothyroidism. It works by replenishing the body's deficient thyroxine and restoring normal thyroid hormone levels. This aids in the relief of hypothyroidism symptoms such as fatigue, weight gain and cold sensitivity. It should be taken as directed by the doctor and in doses and duration as prescribed. Hypothyroidism occures when the thyroid gland does not produce sufficient thyroid hormones. It is characterised by lethargy, tiredness, weight gain, constipation, muscle pain, hair loss, increased sensitivity to cold and low and irregular menstrual cycle. Thyronorm 25 tablet contains levothyroxine as the main ingredient. It is a man-made form of a naturally occurring hormone known as thyroxine produced by the thyroid gland. Thyronorm 25 tablets are usually taken once a day on an empty stomach, at least 30 minutes before breakfast. Individual response and thyroid function tests may be used to adjust the dosage. To ensure consistent levels of thyroxine in the body, take the medication at the same time every day",
    prescriptionRequired: "",
    category: "hypothyroidism",
    indication: "hypothyroidism",
    sideEffects: "Headache, vomiting, diarrhoea",
    therapy: "hypothyroidism",
    "Reference link":
      "https://pharmeasy.in/online-medicine-order/thyronorm-25mcg-bottle-of-120-tablets-174549",
  },
  {
    name: "Euthyrox",
    brand: "MERCK LIMITED",
    dosage: "25mcg",
    stock: "",
    price: 161.28,
    tabCount: 100,
    type: "",
    description:
      "Euthyrox Tablet is used for the treatment of hypothyroidism. It contains levothyroxine as its active component. Levothyroxine is a synthetic form of the thyroid hormone thyroxine produced by the thyroid gland. Thyronorm 25 tablet, Lethyrox 25 tablets and Thyrofit 25 tablet are some other medicines containing levothyroxine as the main ingredient. Hypothyroidism is a condition where the thyroid gland stops producing sufficient thyroid hormones. Take Euthyrox in the morning and as advised by your doctor. This medicine should be taken without food, preferably after waking up. The dose and the duration should be strictly followed as recommended by the doctor.",
    prescriptionRequired: "",
    category: "hypothyroidism",
    indication: "hypothyroidism",
    sideEffects:
      "Increased appetite, hair loss, weight variations, headache, vomiting",
    therapy: "hypothyroidism",
    "Reference link":
      "https://pharmeasy.in/online-medicine-order/euthyrox-25mcg-bottle-of-100-tablets-194511",
  },
  {
    name: "Lethyrox",
    brand: "INTAS PHARMACEUTICALS LTD",
    dosage: "25mcg",
    stock: "",
    price: 147.61,
    tabCount: 100,
    type: "",
    description:
      "Lethyrox 25 tablet is used to treat hypothyroidism, where your thyroid gland cannot provide sufficient thyroxine for the proper functioning of the body. Do not take more than the prescribed dose. If you observe any severe side effects, contact your doctor immediately or rush to the nearest hospital. Euthyrox 25 tablets, Thyronorm 25 tablets and Thyrofit 25 tablet are some other medicines containing levothyroxine as the main ingredient. Store the medication in a cool and dry place, away from direct sunlight and moisture. Before starting the treatment, give a detailed account of your medical history and current medications.",
    prescriptionRequired: "",
    category: "hypothyroidism",
    indication: "hypothyroidism",
    sideEffects:
      "palpitations, vomiting, diarrhoea, anxiety, weight loss, restlessness",
    therapy: "hypothyroidism",
    "Reference link":
      "https://pharmeasy.in/online-medicine-order/lethyrox-25mcg-bottle-of-100-tablets-14171",
  },
  {
    name: "Thyroxinol",
    brand: "KNOLL HEALTHCARE PVT LTD",
    dosage: "25mcg",
    stock: "",
    price: 193.45,
    tabCount: 120,
    type: "",
    description:
      "Thyroxinol Tablet is used for the treatment of hypothyroidism. It contains levothyroxine as its active component. Levothyroxine is a synthetic form of the thyroid hormone thyroxine produced by the thyroid gland. Hypothyroidism is a condition where the thyroid gland stops producing sufficient thyroid hormones. Take Thyroxinol in the morning and as advised by your doctor. This medicine should be taken without food, preferably after waking up. The dose and the duration should be strictly followed as recommended by the doctor.",
    prescriptionRequired: "",
    category: "hypothyroidism",
    indication: "hypothyroidism",
    sideEffects:
      "Increased appetite, hair loss, weight variations, headache, vomiting",
    therapy: "hypothyroidism",
    "Reference link":
      "https://pharmeasy.in/online-medicine-order/thyroxinol-25mcg-bottle-of-120-tablets-3580901",
  },
  {
    name: "Thyrofit",
    brand: "ERIS LIFE SCIENCES PVT LTD",
    dosage: "25mcg",
    stock: "",
    price: 172.03,
    tabCount: 120,
    type: "",
    description:
      "Thyrofit 25 tablet is used for the treatment of hypothyroidism. It contains levothyroxine as its active component. Levothyroxine is a synthetic form of the thyroid hormone thyroxine produced by the thyroid gland. Hypothyroidism is a condition where the thyroid gland stops producing sufficient thyroid hormones. Take Thyrofit in the morning and as advised by your doctor. Euthyrox 25 tablets, Lethyrox 25 tablets and Thyrofit and Thyronorm 25 tablet are some other medicines containing levothyroxine as the main ingredient. This medicine should be taken without food, preferably after waking up. The dose and the duration should be strictly followed as recommended by the doctor.",
    prescriptionRequired: "",
    category: "hypothyroidism",
    indication: "hypothyroidism",
    sideEffects:
      "Increased appetite, hair loss, weight variations, headache, vomiting",
    therapy: "hypothyroidism",
    "Reference link":
      "https://pharmeasy.in/online-medicine-order/thyrofit-25mcg-tablet-120-s-231415",
  },
  {
    name: "Eltroxin",
    brand: "GLAXOSMITHKLINE",
    dosage: "50mcg",
    stock: "",
    price: 119.55,
    tabCount: 120,
    type: "",
    description:
      "Eltroxin Tablet is used for the treatment of hypothyroidism. It contains levothyroxine as its active component. Levothyroxine is a synthetic form of the thyroid hormone thyroxine produced by the thyroid gland. Hypothyroidism is a condition where the thyroid gland stops producing sufficient thyroid hormones. Take Eltroxin in the morning and as advised by your doctor. This medicine should be taken without food, preferably after waking up. The dose and the duration should be strictly followed as recommended by the doctor.",
    prescriptionRequired: "",
    category: "hypothyroidism",
    indication: "hypothyroidism",
    sideEffects:
      "Increased appetite, hair loss, weight variations, headache, vomiting",
    therapy: "hypothyroidism",
    "Reference link":
      "https://pharmeasy.in/online-medicine-order/eltroxin-50mcg-bottle-of-120-tablets-3071469",
  },
  {
    name: "Eltroxin",
    brand: "GLAXOSMITHKLINE",
    dosage: "75mcg",
    stock: "",
    price: 192.19,
    tabCount: 120,
    type: "",
    description:
      "Eltroxin 75mcg tablet is used to control hypothyroidism. Hypothyroidism is a condition where the thyroid gland stops producing sufficient thyroid hormones. Eltroxin 75mcg tablet contains levothyroxine as the active component. Levothyroxine is a synthetic form of the thyroid hormone thyroxine produced naturally by the thyroid gland. Take this medicine in the exact dose and duration as recommended by your doctor. Do not take more than the prescribed dose. Do not stop taking this medicine on your own. Before taking Eltroxin 75mcg tablet, inform your doctor if you are pregnant, planning on becoming pregnant, breastfeeding and about your complete medical history.",
    prescriptionRequired: "",
    category: "hypothyroidism",
    indication: "hypothyroidism",
    sideEffects: "Headache, diarrhoea, vomiting, rashes",
    therapy: "hypothyroidism",
    "Reference link":
      "https://pharmeasy.in/online-medicine-order/eltroxin-75mcg-bottle-of-120-tablets-3095263",
  },
  {
    name: "Thyrox",
    brand: "MACLEODS PHARMACEUTICALS",
    dosage: "50mcg",
    stock: "",
    price: 138.43,
    tabCount: 120,
    type: "",
    description:
      "Thyrox Tablet is used for the treatment of hypothyroidism. It contains levothyroxine as its active component. Levothyroxine is a synthetic form of the thyroid hormone thyroxine produced by the thyroid gland. Hypothyroidism is a condition where the thyroid gland stops producing sufficient thyroid hormones. Take Thyrox in the morning and as advised by your doctor. This medicine should be taken without food, preferably after waking up. The dose and the duration should be strictly followed as recommended by the doctor.",
    prescriptionRequired: "",
    category: "",
    indication: "",
    sideEffects:
      "Increased appetite, hair loss, weight variations, headache, vomiting",
    therapy: "hypothyroidism",
    "Reference link":
      "https://pharmeasy.in/online-medicine-order/thyrox-50mcg-bottle-of-120-tablets-3826516",
  },
  {
    name: "Thyroxinol",
    brand: "KNOLL HEALTHCARE PVT LTD",
    dosage: "100mcg",
    stock: "",
    price: 177.25,
    tabCount: 120,
    type: "",
    description:
      "Thyroxinol Tablet is used for the treatment of hypothyroidism. It contains levothyroxine as its active component. Levothyroxine is a synthetic form of the thyroid hormone thyroxine produced by the thyroid gland. Hypothyroidism is a condition where the thyroid gland stops producing sufficient thyroid hormones. Take Thyroxinol in the morning and as advised by your doctor. This medicine should be taken without food, preferably after waking up. The dose and the duration should be strictly followed as recommended by the doctor.",
    prescriptionRequired: "",
    category: "",
    indication: "",
    sideEffects:
      "Increased appetite, hair loss, weight variations, headache, vomiting",
    therapy: "hypothyroidism",
    "Reference link":
      "https://pharmeasy.in/online-medicine-order/thyroxinol-100mcg-bottle-of-120-tablets-3554059",
  },
];

const testImgs = [
  "https://cdn01.pharmeasy.in/dam/products/064425/ecosprin-75mg-strip-of-14-tablets-1-1647434835.jpg?dim=320x320&dpr=1&q=100",
  "https://cdn01.pharmeasy.in/dam/products_otc/Q84402/abzorb-total-skin-relief-dusting-powder-20-extra-bottle-of-120gm-2-1712152617.jpg?dim=1440x0",
  "https://cdn01.pharmeasy.in/dam/products_otc/H82654/vansaar-45-diab-balance-juice-bottle-of-1-ltr-2-1698925291.jpg?dim=1440x0",
  "https://cdn01.pharmeasy.in/dam/products_otc/A28033/diataal-nutripop-multivitamin-hair-skin-energy-immunity-for-fitness-wellness-45-capsules-2-1705913044.jpg?dim=1440x0",
  "https://cdn01.pharmeasy.in/dam/products_otc/T22634/liveasy-wellness-calcium-magnesium-vitamin-d3-zinc-bones-dental-health-bottle-60-tabs-2-1661760061.jpg?dim=1440x0",
  "https://cdn01.pharmeasy.in/dam/products_otc/S04683/evion-400mg-strip-of-20-capsule-2-1683208555.jpg?dim=1440x0",
  "https://cdn01.pharmeasy.in/dam/products_otc/188996/zincovit-strip-of-15-tablets-green-2-1702990444.jpg?dim=1440x0",
  "https://cdn01.pharmeasy.in/dam/products/269217/pacimol-650mg-strip-of-15-tablets-2-1654073117.jpg?dim=1440x0",
  "https://cdn01.pharmeasy.in/dam/products/064425/ecosprin-75mg-strip-of-14-tablets-1-1647434835.jpg?dim=1440x0",
];

export const addTestDataToFirebase = async () => {
  await Promise.all(
    testData.map(async (product: any) => {
      const productId = uuidv4();

      // Add 3 random images to the product
      const randomImages = testImgs.sort(() => 0.5 - Math.random()).slice(0, 3);
      product.images = randomImages;
      product.id = productId;

      await setDoc(doc(db, "products", productId), product);
    })
  );
};
