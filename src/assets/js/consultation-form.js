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
    messageDiv.className = `form-message p-4 rounded-lg mb-6 ${
      type === "success"
        ? "bg-green-100 text-green-800 border border-green-200"
        : "bg-red-100 text-red-800 border border-red-200"
    }`;
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
    let missingPhotos = [];

    selectedProcedures.forEach((procedureCheckbox) => {
      const procedureValue = procedureCheckbox.value;

      if (procedureValue === "deep-plane-facelift") {
        const front = form.querySelector('input[name="deep_plane_front"]');
        const left = form.querySelector('input[name="deep_plane_left"]');
        const right = form.querySelector('input[name="deep_plane_right"]');

        if (!front.files.length || !left.files.length || !right.files.length) {
          missingPhotos.push("Deep Plane Facelift - wymagane są wszystkie 3 zdjęcia twarzy");
        }
      }

      if (procedureValue === "upper-eyelid") {
        const closed = form.querySelector('input[name="upper_eyelid_closed"]');
        const open = form.querySelector('input[name="upper_eyelid_open"]');

        if (!closed.files.length || !open.files.length) {
          missingPhotos.push("Korekcja powiek górnych - wymagane są zdjęcia oczu zamkniętych i otwartych");
        }
      }

      if (procedureValue === "lower-eyelid") {
        const closed = form.querySelector('input[name="lower_eyelid_closed"]');
        const open = form.querySelector('input[name="lower_eyelid_open"]');

        if (!closed.files.length || !open.files.length) {
          missingPhotos.push("Korekcja powiek dolnych - wymagane są zdjęcia oczu zamkniętych i otwartych");
        }
      }

      if (procedureValue === "nose-correction") {
        const left = form.querySelector('input[name="nose_left"]');
        const right = form.querySelector('input[name="nose_right"]');
        const front = form.querySelector('input[name="nose_front"]');
        const bottom = form.querySelector('input[name="nose_bottom"]');

        if (!left.files.length || !right.files.length || !front.files.length || !bottom.files.length) {
          missingPhotos.push("Korekcja nosa - wymagane są wszystkie 4 zdjęcia nosa");
        }
      }

      if (procedureValue === "ear-correction") {
        const left = form.querySelector('input[name="ears_left"]');
        const right = form.querySelector('input[name="ears_right"]');

        if (!left.files.length || !right.files.length) {
          missingPhotos.push("Korekcja uszu - wymagane są zdjęcia lewego i prawego ucha");
        }
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
    submitButton.classList.add("opacity-50", "cursor-not-allowed");

    // Przygotuj dane formularza
    const formData = new FormData(form);

    // Wyślij formularz - update 12082025-1415
    fetch("process-form.php", {
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
        submitButton.classList.remove("opacity-50", "cursor-not-allowed");
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
        errorDiv.className = "age-error mt-1 text-sm text-red-600";
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
        errorDiv.className = "email-error mt-1 text-sm text-red-600";
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
          errorDiv.className = "file-error mt-1 text-sm text-red-600";
          errorDiv.textContent = "Plik jest za duży. Maksymalny rozmiar to 8MB.";
          this.parentNode.appendChild(errorDiv);
          this.value = ""; // Wyczyść input
          return;
        }

        // Sprawdź typ pliku
        if (!file.type.startsWith("image/")) {
          const errorDiv = document.createElement("p");
          errorDiv.className = "file-error mt-1 text-sm text-red-600";
          errorDiv.textContent = "Proszę wybrać plik graficzny (JPG, PNG, itp.).";
          this.parentNode.appendChild(errorDiv);
          this.value = ""; // Wyczyść input
          return;
        }

        // Pokaż informację o wybranym pliku
        const successDiv = document.createElement("p");
        successDiv.className = "file-success mt-1 text-sm text-green-600";
        successDiv.textContent = `Wybrano: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB)`;
        this.parentNode.appendChild(successDiv);
      }
    });
  });
});
