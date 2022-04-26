import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:mobileapp/app/colors.dart';
import 'package:mobileapp/app/const_names.dart';
import 'package:mobileapp/screens/settings/notifications/bloc/notifications_bloc.dart';
import 'package:mobileapp/screens/settings/vibration/cubit/vibration_cubit.dart';
import 'package:mobileapp/screens/settings/widgets/selector.dart';
import 'package:mobileapp/screens/shared_widgets/helper.dart';
import 'package:notifications_repository/notifications_repository.dart';

class VibrationSection extends StatelessWidget {
  const VibrationSection({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return SidePadding(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          _title,
          _selector,
        ],
      ),
    );
  }

  Widget get _title => Padding(
        padding: EdgeInsets.only(bottom: 20.w),
        child: Text(
          "Vibration",
          style: TextStyle(
            fontFamily: AppFonts.londrina,
            fontSize: 36.sp,
            color: AppColors.textColor,
          ),
        ),
      );

  Widget get _selector => BlocBuilder<VibrationCubit, VibrationStatus>(
        builder: (context, state) {
          return Selector(
            type: "Vibration",
            text: "On new noun",
            value: state.isEnabled,
            onChange: (newValue) {
              context.read<VibrationCubit>().state.isEnabled
                  ? context.read<VibrationCubit>().disable()
                  : context.read<VibrationCubit>().enable();
            },
          );
        },
      );
}
