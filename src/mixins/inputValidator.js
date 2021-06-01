export default {
  methods: {
    isValidEmail(text) {
      const emailParts = text.split("@");

      if (emailParts.length !== 2) {
        return false;
      } else {
        const emailName = emailParts[0];
        const emailDomain = emailParts[1].split(".");

        if (emailDomain.includes("")) return false;

        if (emailName.length < 1 || emailDomain.length < 2) {
          return false;
        }
      }

      return true;
    }
  }
};
