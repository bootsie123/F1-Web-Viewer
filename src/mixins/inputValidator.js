export default {
  methods: {
    isValidEmail(text) {
      const emailParts = text.split("@");

      if (emailParts.length !== 2) {
        return false;
      } else {
        const emailName = emailParts[0];
        const emailDomain = emailParts[1].split(".");

        if (
          emailName.length <= 0 ||
          emailDomain.length !== 2 ||
          emailDomain[0].length <= 0 ||
          emailDomain[1].length <= 0
        ) {
          return false;
        }
      }

      return true;
    }
  }
};
