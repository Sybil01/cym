t-obra
2025-08-14
async (text_items, items, throw_on_cancel = false, placeholder = "", limit) => {
      const suggester = new SuggesterModal(text_items, items, placeholder, limit);
      const promise = new Promise((resolve, reject) => suggester.openAndGetValue(resolve, reject));
      try {
        return await promise;
      } catch (error) {
        if (throw_on_cancel) {
          throw error;
        }
        return null;
      }
    }
