document.addEventListener('DOMContentLoaded', () => {
    
    // 1. تحديث سنة الحقوق تلقائياً
    document.getElementById('year').textContent = new Date().getFullYear();

    // 2. التحكم في قائمة الموبايل
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileNav = document.getElementById('mobileNav');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    mobileMenuBtn.addEventListener('click', () => {
        mobileNav.classList.toggle('active');
    });

    // إغلاق القائمة عند النقر على أي رابط
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileNav.classList.remove('active');
        });
    });

    // 3. تحديد الباقة تلقائياً ونقل المستخدم للنموذج
    const selectPkgBtns = document.querySelectorAll('.select-pkg-btn');
    const packageSelect = document.getElementById('package');

    selectPkgBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const pkgName = e.target.getAttribute('data-pkg');
            if (pkgName) {
                packageSelect.value = pkgName;
                // التمرير السلس إلى النموذج
                document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // 4. التحقق من النموذج وإرساله
    const form = document.getElementById('contactForm');
    const successMessage = document.getElementById('successMessage');
    const resetFormBtn = document.getElementById('resetFormBtn');
    const submitBtn = document.getElementById('submitBtn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    const formError = document.getElementById('formError');

    // إخفاء رسائل الخطأ عند الكتابة
    const inputs = form.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            input.classList.remove('error');
            const errorSpan = document.getElementById(input.id + 'Error');
            if (errorSpan) errorSpan.textContent = '';
        });
    });

    // دالة التحقق
    function validateForm() {
        let isValid = true;
        
        // التحقق من الاسم
        const name = document.getElementById('name');
        const nameError = document.getElementById('nameError');
        if (name.value.trim() === '') {
            name.classList.add('error');
            nameError.textContent = 'الاسم مطلوب';
            isValid = false;
        }

        // التحقق من الهاتف (أرقام مصرية 11 رقم تبدأ بـ 01)
        const phone = document.getElementById('phone');
        const phoneError = document.getElementById('phoneError');
        const phoneRegex = /^01[0-9]{9}$/;
        if (!phoneRegex.test(phone.value.trim())) {
            phone.classList.add('error');
            phoneError.textContent = 'رقم هاتف غير صحيح (11 رقم يبدأ بـ 01)';
            isValid = false;
        }

        // التحقق من نوع المشروع
        const projectType = document.getElementById('projectType');
        const projectTypeError = document.getElementById('projectTypeError');
        if (projectType.value === '') {
            projectType.classList.add('error');
            projectTypeError.textContent = 'يرجى اختيار نوع المشروع';
            isValid = false;
        }

        return isValid;
    }

    // التعامل مع الإرسال
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;

        // إخفاء رسالة الخطأ السابقة
        formError.classList.add('hidden');
        
        // حالة التحميل
        submitBtn.disabled = true;
        btnText.classList.add('hidden');
        btnLoading.classList.remove('hidden');

        // تجهيز البيانات
        const formData = {
            name: document.getElementById('name').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            projectType: document.getElementById('projectType').value,
            package: document.getElementById('package').value,
            budget: document.getElementById('budget').value.trim(),
            details: document.getElementById('details').value.trim()
        };

        // ==========================================
        // إعداد رابط Google Apps Script هنا
        // استبدل الرابط أدناه برابط النشر الخاص بك
        // ==========================================
        const SCRIPT_URL = "https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec"; 

        try {
            if (SCRIPT_URL.includes("YOUR_SCRIPT_ID")) {
                // محاكاة الإرسال في حال عدم إعداد الرابط
                console.log("بيانات النموذج (محاكاة):", formData);
                await new Promise(resolve => setTimeout(resolve, 1500));
                
                // إظهار النجاح
                form.classList.add('hidden');
                successMessage.classList.remove('hidden');
            } else {
                // إرسال حقيقي
                const response = await fetch(SCRIPT_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'text/plain;charset=utf-8',
                    },
                    body: JSON.stringify(formData)
                });

                if (response.ok) {
                    form.classList.add('hidden');
                    successMessage.classList.remove('hidden');
                    form.reset();
                } else {
                    throw new Error('Network response was not ok');
                }
            }
        } catch (error) {
            console.error('Error:', error);
            formError.classList.remove('hidden');
        } finally {
            // إعادة الزر لحالته الطبيعية
            submitBtn.disabled = false;
            btnText.classList.remove('hidden');
            btnLoading.classList.add('hidden');
        }
    });

    // إعادة تعيين النموذج بعد النجاح
    resetFormBtn.addEventListener('click', () => {
        successMessage.classList.add('hidden');
        form.classList.remove('hidden');
        form.reset();
    });
});