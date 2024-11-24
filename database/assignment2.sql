-- Assignment 1

-- 1.
Insert into public.account (account_firstname, account_lastname, account_email, account_password)
Values ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');

-- 2.
Update public.account set account_type = 'Admin'
Where account_id = 1;

-- 3.
Delete from public.account
Where account_id = 1;

-- 4.
update public.inventory set inv_description = Replace(inv_description, 'the small interiors', 'a huge interior')
where inv_make = 'GM' and inv_model = 'Hummer';

-- 5.
select i.inv_make, i.inv_model, c.classification_name
from public.inventory i
inner join public.classification c
on i.classification_id = c.classification_id
where c.classification_name = 'Sport';

-- 6.
update public.inventory set inv_image = replace(inv_image, 'images', 'images/vehicles'), 
inv_thumbnail = replace(inv_thumbnail, 'images', 'images/vehicles');
