function welcomeVisitor() { let name = document.querySelector("#visitorName").value.trim();
let welcome = document.querySelector("#welcome");
welcome.innerHTML = " يا هلا والله بالرهيب <span>" + name + "(:" ;
welcome.style.fontFamily = /[\u0600-\u06FF]/.test(name)

        ? "'Tajawal', sans-serif"

        : "'Poppins', sans-serif";
}// معلومات مراحل عمل الويب
const stages = [
    {
        title: "المستخدم",
        description: "يكتب عنوان الموقع في المتصفح."
    },
    {
        title: "المتصفح",
        description: "يرسل طلبًا إلى خادم الموقع."
    },
    {
        title: "الخادم",
        description: "يستقبل الطلب ويجهز البيانات المطلوبة."
    },
    {
        title: "قاعدة البيانات",
        description: "يتم الرجوع إليها لجلب المعلومات."
    },
    {
        title: "عودة النتيجة",
        description: "يرسل الخادم الصفحة والبيانات إلى المتصفح، فتظهر لك بشكل جميل."
    }
];
// اختيار المرحلة وعرض شرحها
function showStage(index) {
const buttons = document.querySelectorAll(".stage");

buttons.forEach((button, i) => {
    button.classList.toggle("active", i === index);
});

document.querySelector("#stageTitle").textContent = stages[index].title;
document.querySelector("#stageDescription").textContent = stages[index].description;
}

// عند الضغط على أي مرحلة
document.querySelectorAll(".stage").forEach((button) => {
button.addEventListener("click", () => {
showStage(Number(button.dataset.stage));
});
});
// تشغيل الرحلة بالتتابع
document.querySelector("#startJourney").addEventListener("click", () => {
let currentStage = 0;

showStage(currentStage);

const journey = setInterval(() => {
    currentStage++;

    if (currentStage >= stages.length) {
        clearInterval(journey);
        return;
    }

    showStage(currentStage);
}, 2000);
});
document.addEventListener("DOMContentLoaded", function () {

  const runButton = document.querySelector("#run-code");
  const codeEditor = document.querySelector("#html-code");
  const output = document.querySelector("#code-output");

  if (runButton && codeEditor && output) {
    runButton.addEventListener("click", function () {
      output.srcdoc = `
  <body style="background:#f5f0ff; color:#684394; font-family:Arial; text-align:center; padding:15px;">
    ${codeEditor.value}
  </body>
  `;
    });
    }
    });
   document.addEventListener("DOMContentLoaded", function () {

  const cssRun = document.querySelector("#css-run");
  const phrase = document.querySelector("#flower-phrase");

  if (cssRun && phrase) {
    cssRun.addEventListener("click", function () {
      phrase.classList.toggle("bloom");
    });
  }

});
// تجربة JavaScript التفاعلية

const labButton = document.querySelector("#lab-button");

if (labButton) {

  let currentStep = 0;

  const steps = [

    {

      title: "بدأنا ببناء الهيكل! 🧱",

      description: "HTML أنشأت عناصر الصفحة ومحتواها.",

      result: "HTML تبني هيكل الموقع.",

      button: "أضفنا التصميم 🎨",

      active: "html-tag"

    },

    {

      title: "أصبح الموقع أجمل! 🎨",

      description: "CSS أضافت الألوان والتنسيقات.",

      result: "CSS تمنح الموقع مظهره الجميل.",

      button: "أضفنا التفاعل ✨",

      active: "css-tag"

    },

    {

      title: "الآن أصبح الموقع تفاعليًا! 🚀",

      description: "JavaScript جعلت الصفحة تستجيب لأوامرك.",

      result: "JavaScript تمنح الموقع الحياة والتفاعل.",

      button: "أعيد التجربة ↩",

      active: "js-tag"

    }

  ];

  labButton.addEventListener("click", function () {

    const step = steps[currentStep];

    document.querySelector("#lab-title").textContent = step.title;

    document.querySelector("#lab-description").textContent = step.description;

    document.querySelector("#lab-result").textContent = step.result;

    document.querySelectorAll(".language-tags span").forEach(tag => {

      tag.classList.remove("selected");

    });

    document.querySelector("#" + step.active).classList.add("selected");

    labButton.textContent = step.button;

    currentStep = (currentStep + 1) % steps.length;

  });

}

// تجربة Frontend و Backend

const orderButton = document.querySelector("#order-demo-button");

if (orderButton) {

  let orderRunning = false;

  let orderTimers = [];

  const frontendStatus = document.querySelector("#frontend-status");

  const backendStatus = document.querySelector("#backend-status");

  const processes = [

    document.querySelector("#process-one"),

    document.querySelector("#process-two"),

    document.querySelector("#process-three")

  ];

  orderButton.addEventListener("click", function () {

    // إعادة التجربة إلى البداية

    if (orderRunning) {

      orderTimers.forEach(timer => clearTimeout(timer));

      orderTimers = [];

      orderRunning = false;

      processes.forEach(process => {

        process.classList.remove("done");

        process.querySelector("b").textContent = "待";

      });

      frontendStatus.textContent = "بانتظار طلبك...";

      backendStatus.textContent = "النظام جاهز لاستقبال الطلبات";

      orderButton.textContent = "اطلب الآن 🛒";

      return;

    }

    orderRunning = true;

    orderButton.textContent = "إعادة التجربة ↩";

    frontendStatus.textContent = "تم إرسال طلبك إلى الخادم...";

    backendStatus.textContent = "جارٍ استقبال الطلب...";

    const messages = [

      "تم التحقق من توفر المنتج ✓",

      "تمت معالجة بيانات الطلب ✓",

      "تم تسجيل الطلب بنجاح ✓"

    ];

    processes.forEach((process, index) => {

      const timer = setTimeout(() => {

        process.classList.add("done");

        process.querySelector("b").textContent = "✓";

        backendStatus.textContent = messages[index];

        if (index === 2) {

          frontendStatus.textContent =

            "تم تأكيد طلبك بنجاح! 🎉";

        }

      }, (index + 1) * 1200);

      orderTimers.push(timer);

    });

  });

}
