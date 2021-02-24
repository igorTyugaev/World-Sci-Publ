function initForm(_form) {

    _form.addEventListener('submit', (e) => {
        e.preventDefault();
        let codeStatus = true;
        const {currentTarget} = e;
        const idPopup = currentTarget.hasAttribute("data-popup")
            ? currentTarget.getAttribute("data-popup")
            : null;
        const data = scrabbleInputs(currentTarget);
        const button = currentTarget.querySelector('[data-show-popup]');
        const showPopUpLogic = popups.get(button.dataset.showPopup);

        if (data) {
            console.log("Отправка формы...")
            sendForm(data, currentTarget);
            if (codeStatus) {
                showPopUpLogic();
                currentTarget.reset();
            }
        }

        function inputIsValidation(input) {
            const hint = input.parentNode.querySelector(".input-wrapper__error");
            switch (input.getAttribute("name")) {
                case "phone":
                    if (input.validity.valid) {
                        removeErrorInput(input, hint);
                        return true;
                    } else {
                        setErrorInput(input, hint, "Недопустимый номер телефона!");
                        return false;
                    }
                    break;
                case "email":
                    if (input.validity.valid) {
                        removeErrorInput(input, hint);
                        return true;
                    } else {
                        setErrorInput(input, hint, "Недопустимый email!");
                        return false;
                    }
                    break;
                case "name":
                    if (input.validity.valid) {
                        removeErrorInput(input, hint);
                        return true;
                    } else {
                        setErrorInput(input, hint, "Как к Вам обращаться?");
                        return false;
                    }
                    break;
                case "coupon":
                    codeStatus = false;
                    return true
                    break;
                default:
                    return true;
                    break;
            }
        }

        function setErrorInput(input, hint, textError) {
            input.style.borderColor = "red";
            hint.classList.add("input-wrapper__error--show");
            hint.innerHTML = "- " + textError;
        }

        function removeErrorInput(input, hint) {
            if (input.hasAttribute("style"))
                input.removeAttribute("style");
            hint.classList.remove("input-wrapper__error--show");
            hint.innerHTML = "";
        }

        function scrabbleInputs(currentForm) {
            const entries = new Map([]);
            const inputs = currentForm.querySelectorAll('input');
            let isValidity = true;

            inputs.forEach((input, index) => {
                const _isValidity = inputIsValidation(input);

                if (_isValidity) {
                    entries.set(input.name, input.value);
                }
                isValidity &= _isValidity;
            });

            if (!isValidity) return null;

            if (idPopup == 7 && answersQuizlet) {
                entries.set("res", answersQuizlet);
                answersQuizlet = null;
            }

            entries.set("csrfToken", csrfToken);
            entries.set("formsended", currentForm.getAttribute("name"));

            const data = Object.fromEntries(entries);
            return data;
        }

        function sendForm(sendData, currentForm) {
            axios.post('https://worldscipubl.com/main-test/', sendData)
                .then((response) => {
                    const inputs = currentForm.querySelectorAll('input');
                    const input = inputs[inputs.length - 1];
                    const hint = input.parentNode.querySelector(".input-wrapper__error");
                    const resData = response.data;

                    if (resData['warning']) {
                        const resDataWarning = resData['warning'];

                        if (resDataWarning['coupon'])
                            setErrorInput(input, hint, resDataWarning['coupon']);
                        else if (resDataWarning['time'])
                            setErrorInput(input, hint, resDataWarning['time']);

                        codeStatus = false;
                    } else if (resData['coupon']) {
                        console.log("Промокод успешно активирован!");
                        codeStatus = true;
                        showPopUpLogic();
                        currentForm.reset();
                        removeErrorInput(input, hint);
                    }
                    console.log(response);
                }, (error) => {
                    console.log(error);
                });
        }
    });
}

const forms = document.querySelectorAll('form');
forms.forEach((_form) => {
    initForm(_form);
});