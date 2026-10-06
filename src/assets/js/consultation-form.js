// Obsługa formularza konsultacji online
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("consultation-form");
  const submitButton = form.querySelector('button[type="submit"]');
  const originalButtonText = submitButton.textContent;

  // Obsługa pokazywania/ukrywania pól upload dla każdego zabiegu
  const procedureOptions = document.querySelectorAll('.procedure-option input[type="checkbox"]');

  procedureOptions.forEach((checkbox) => {
    checkbox.addEventListener("change", function () {
      const uploadsDiv = this.closest(".procedure-option").querySelector("[data-uploads]");
      if (uploadsDiv) {
        if (this.checked) {
          uploadsDiv.classList.remove("hidden");
        } else {
          uploadsDiv.classList.add("hidden");
        }
      }
    });
  });

  // Funkcja pokazywania komunikatu
  function showMessage(message, type = "success") {
    // Usuń poprzedni komunikat jeśli istnieje
    const existingMessage = document.querySelector(".form-message");
    if (existingMessage) {
      existingMessage.remove();
    }

    // Utwórz nowy komunikat
    const messageDiv = document.createElement("div");
    messageDiv.className = `form-message ${type === "success" ? "form-message--ok" : "form-message--err"}`;
    messageDiv.style.whiteSpace = "pre-line";
    messageDiv.textContent = message;

    // Wstaw komunikat na początku formularza
    form.insertBefore(messageDiv, form.firstChild);

    // Przewiń do komunikatu
    messageDiv.scrollIntoView({ behavior: "smooth" });

    // Automatyczne usunięcie komunikatu sukcesu po 10 sekundach
    if (type === "success") {
      setTimeout(() => {
        if (messageDiv && messageDiv.parentNode) {
          messageDiv.remove();
        }
      }, 10000);
    }
  }

  // Obsługa wysyłania formularza
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Sprawdź czy wybrano przynajmniej jeden zabieg
    const selectedProcedures = form.querySelectorAll('input[name="procedures[]"]:checked');
    if (selectedProcedures.length === 0) {
      showMessage("Proszę wybrać przynajmniej jeden zabieg.", "error");
      return;
    }

    // Sprawdź czy dla wybranych zabiegów przesłano wymagane zdjęcia
    // (pole, którego nie ma w formularzu, jest pomijane — nie blokuje wysyłki)
    const noPhoto = (...names) =>
      names.some((name) => {
        const input = form.querySelector(`input[name="${name}"]`);
        return input && !input.files.length;
      });
    const requiredPhotos = {
      "deep-plane-facelift": [["deep_plane_front", "deep_plane_left", "deep_plane_right"], "Deep Plane Facelift - wymagane są wszystkie 3 zdjęcia twarzy"],
      "upper-eyelid": [["upper_eyelid_closed", "upper_eyelid_open"], "Korekcja powiek górnych - wymagane są zdjęcia oczu zamkniętych i otwartych"],
      "lower-eyelid": [["lower_eyelid_closed", "lower_eyelid_open"], "Korekcja powiek dolnych - wymagane są zdjęcia oczu zamkniętych i otwartych"],
      "nose-correction": [["nose_left", "nose_right", "nose_front", "nose_bottom"], "Korekcja nosa - wymagane są wszystkie 4 zdjęcia nosa"],
      "ear-correction": [["ears_left", "ears_right"], "Korekcja uszu - wymagane są zdjęcia lewego i prawego ucha"],
    };
    let missingPhotos = [];

    selectedProcedures.forEach((procedureCheckbox) => {
      const required = requiredPhotos[procedureCheckbox.value];
      if (required && noPhoto(...required[0])) {
        missingPhotos.push(required[1]);
      }
    });

    if (missingPhotos.length > 0) {
      showMessage("Brakujące zdjęcia:\n" + missingPhotos.join("\n"), "error");
      return;
    }

    // Sprawdź czy wybrano lekarza
    const selectedDoctor = form.querySelector('input[name="doctor"]:checked');
    if (!selectedDoctor) {
      showMessage("Proszę wybrać specjalistę.", "error");
      return;
    }

    // Sprawdź czy zaakceptowano wszystkie wymagane warunki
    const requiredTerms = ["adult", "regulations", "privacy"];
    const checkedTerms = Array.from(form.querySelectorAll('input[name="terms[]"]:checked')).map((cb) => cb.value);

    for (let term of requiredTerms) {
      if (!checkedTerms.includes(term)) {
        showMessage("Proszę zaakceptować wszystkie wymagane warunki.", "error");
        return;
      }
    }

    // Zmień stan przycisku
    submitButton.disabled = true;
    submitButton.textContent = "Wysyłanie...";

    // Przygotuj dane formularza
    const formData = new FormData(form);

    // Wyślij formularz (adres z atrybutu action — działa także z /en/)
    fetch(form.getAttribute("action") || "process-form.php", {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        // Sprawdź czy odpowiedź jest OK
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Sprawdź czy odpowiedź zawiera JSON
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          // Spróbuj pobrać tekst błędu z odpowiedzi
          return response.text().then((text) => {
            console.error("Odpowiedź serwera:", text);
            throw new Error("Serwer nie zwrócił odpowiedzi JSON. Sprawdź konsolę dla szczegółów.");
          });
        }

        return response.json();
      })
      .then((data) => {
        if (data.status === "success") {
          showMessage(data.message, "success");
          // Wyczyść formularz po sukcesie
          form.reset();
          // Ukryj wszystkie sekcje upload
          document.querySelectorAll("[data-uploads]").forEach((div) => {
            div.classList.add("hidden");
          });
          // Usuń komunikaty o plikach
          document.querySelectorAll(".file-success, .file-error").forEach((msg) => {
            msg.remove();
          });
        } else {
          let errorMessage = data.message;
          if (data.errors && Array.isArray(data.errors)) {
            errorMessage += ":\n" + data.errors.join("\n");
          }
          showMessage(errorMessage, "error");
        }
      })
      .catch((error) => {
        console.error("Błąd:", error);

        // Pokaż bardziej szczegółowy komunikat błędu
        let errorMessage = "Wystąpił błąd podczas wysyłania formularza. ";

        if (error.message.includes("HTTP error")) {
          errorMessage += "Błąd serwera (kod: " + error.message.split("status: ")[1] + "). ";
        } else if (error.message.includes("JSON")) {
          errorMessage += "Serwer zwrócił nieprawidłową odpowiedź. ";
        }

        errorMessage += "Spróbuj ponownie lub skontaktuj się z nami telefonicznie.";

        showMessage(errorMessage, "error");
      })
      .finally(() => {
        // Przywróć stan przycisku
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
      });
  });

  // Walidacja wieku w czasie rzeczywistym
  const ageInput = form.querySelector('input[name="age"]');
  if (ageInput) {
    ageInput.addEventListener("input", function () {
      const age = parseInt(this.value);
      const errorDiv = this.parentNode.querySelector(".age-error");

      if (errorDiv) {
        errorDiv.remove();
      }

      if (this.value && (age < 18 || age > 120)) {
        const errorDiv = document.createElement("p");
        errorDiv.className = "age-error field-msg field-msg--err";
        errorDiv.textContent = "Wiek musi być między 18 a 120 lat";
        this.parentNode.appendChild(errorDiv);
      }
    });
  }

  // Walidacja email w czasie rzeczywistym
  const emailInput = form.querySelector('input[name="email"]');
  if (emailInput) {
    emailInput.addEventListener("blur", function () {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const errorDiv = this.parentNode.querySelector(".email-error");

      if (errorDiv) {
        errorDiv.remove();
      }

      if (this.value && !emailRegex.test(this.value)) {
        const errorDiv = document.createElement("p");
        errorDiv.className = "email-error field-msg field-msg--err";
        errorDiv.textContent = "Proszę podać prawidłowy adres email";
        this.parentNode.appendChild(errorDiv);
      }
    });
  }

  // Walidacja plików (rozmiar i typ)
  const fileInputs = form.querySelectorAll('input[type="file"]');
  const maxFileSize = 8 * 1024 * 1024; // 8MB w bajtach

  fileInputs.forEach((input) => {
    input.addEventListener("change", function () {
      const errorDiv = this.parentNode.querySelector(".file-error");
      if (errorDiv) {
        errorDiv.remove();
      }

      if (this.files.length > 0) {
        const file = this.files[0];

        // Sprawdź rozmiar pliku
        if (file.size > maxFileSize) {
          const errorDiv = document.createElement("p");
          errorDiv.className = "file-error field-msg field-msg--err";
          errorDiv.textContent = "Plik jest za duży. Maksymalny rozmiar to 8MB.";
          this.parentNode.appendChild(errorDiv);
          this.value = ""; // Wyczyść input
          return;
        }

        // Sprawdź typ pliku
        if (!file.type.startsWith("image/")) {
          const errorDiv = document.createElement("p");
          errorDiv.className = "file-error field-msg field-msg--err";
          errorDiv.textContent = "Proszę wybrać plik graficzny (JPG, PNG, itp.).";
          this.parentNode.appendChild(errorDiv);
          this.value = ""; // Wyczyść input
          return;
        }

        // Pokaż informację o wybranym pliku
        const successDiv = document.createElement("p");
        successDiv.className = "file-success field-msg field-msg--ok";
        successDiv.textContent = `Wybrano: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB)`;
        this.parentNode.appendChild(successDiv);
      }
    });
  });
});
