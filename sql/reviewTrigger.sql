DELIMITER $$

CREATE TRIGGER insert_restaurant_rating
AFTER INSERT ON reviews
FOR EACH ROW
BEGIN
  DECLARE new_rating FLOAT;

  SELECT AVG(rating) INTO new_rating
  FROM reviews
  WHERE restaurant_id = NEW.restaurant_id;

  UPDATE restaurant
  SET rating = IFNULL(new_rating, 0)
  WHERE restaurant_id = NEW.restaurant_id;
END$$

DELIMITER ;


DELIMITER $$

CREATE TRIGGER update_restaurant_rating
AFTER UPDATE ON reviews
FOR EACH ROW
BEGIN
  DECLARE new_rating FLOAT;

  SELECT AVG(rating) INTO new_rating
  FROM reviews
  WHERE restaurant_id = NEW.restaurant_id;

  UPDATE restaurant
  SET rating = IFNULL(new_rating, 0)
  WHERE restaurant_id = NEW.restaurant_id;
END$$

DELIMITER ;


DELIMITER $$

CREATE TRIGGER delete_restaurant_rating
AFTER DELETE ON reviews
FOR EACH ROW
BEGIN
  DECLARE new_rating FLOAT;

  SELECT AVG(rating) INTO new_rating
  FROM reviews
  WHERE restaurant_id = OLD.restaurant_id;

  UPDATE restaurant
  SET rating = IFNULL(new_rating, 0)
  WHERE restaurant_id = OLD.restaurant_id;
END$$

DELIMITER ;